import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getOrderById, updateOrderStatus, decrementStock } from '@/lib/sheets';
import { sendPaymentConfirmedEmail } from '@/lib/email';

// Logging helper
function logPayment(operation: string, details?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'payment',
      operation,
      ...details,
    })
  );
}

// Verify Flutterwave webhook signature
function verifyWebhookSignature(signature: string | null): boolean {
  const secretHash = process.env.FLW_WEBHOOK_HASH;
  if (!secretHash || !signature) {
    return false;
  }
  return signature === secretHash;
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const signature = headersList.get('verif-hash');

    // Verify webhook signature
    if (!verifyWebhookSignature(signature)) {
      logPayment('webhook:invalidSignature', { signature });
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 401 });
    }

    const payload = await request.json();
    logPayment('webhook:received', {
      event: payload.event,
      txRef: payload.data?.tx_ref,
      status: payload.data?.status,
    });

    // Only process successful charge events
    if (payload.event !== 'charge.completed' || payload.data?.status !== 'successful') {
      logPayment('webhook:ignoredEvent', { event: payload.event, status: payload.data?.status });
      return NextResponse.json({ status: 'ok' });
    }

    const { tx_ref, id, amount, currency, meta } = payload.data;
    const orderId = meta?.order_id;
    const orderNumber = meta?.order_number;

    if (!orderId) {
      logPayment('webhook:missingOrderId', { txRef: tx_ref });
      return NextResponse.json({ status: 'error', message: 'Missing order ID' }, { status: 400 });
    }

    // Get order
    const order = await getOrderById(orderId);
    if (!order) {
      logPayment('webhook:orderNotFound', { orderId });
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 });
    }

    // Idempotency check: if already paid, return success
    if (order.status === 'PAID') {
      logPayment('webhook:alreadyPaid', { orderId, orderNumber });
      return NextResponse.json({ status: 'ok', message: 'Already processed' });
    }

    // Verify amount and currency
    if (amount < order.totalKes || currency !== 'KES') {
      logPayment('webhook:amountMismatch', {
        orderId,
        expectedAmount: order.totalKes,
        actualAmount: amount,
        currency,
      });
      return NextResponse.json(
        { status: 'error', message: 'Amount or currency mismatch' },
        { status: 400 }
      );
    }

    // Update order status to PAID
    const updated = await updateOrderStatus(order.id, 'PAID', id.toString());
    if (!updated) {
      logPayment('webhook:updateFailed', { orderId });
      return NextResponse.json({ status: 'error', message: 'Update failed' }, { status: 500 });
    }

    // Decrement stock for all items
    for (const item of order.items) {
      const result = await decrementStock(item.variantId, item.qty);
      if (!result.success) {
        logPayment('webhook:stockDecrementFailed', {
          orderId,
          variantId: item.variantId,
          qty: item.qty,
        });
      }
    }

    // Send confirmation email
    await sendPaymentConfirmedEmail({
      ...order,
      status: 'PAID',
      paymentRef: id.toString(),
    });

    logPayment('webhook:success', { orderId, orderNumber, transactionId: id });
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    logPayment('webhook:error', { error: String(error) });
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error', message: 'Internal error' }, { status: 500 });
  }
}
