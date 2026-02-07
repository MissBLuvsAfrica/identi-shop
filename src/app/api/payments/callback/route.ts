import { NextRequest, NextResponse } from 'next/server';
import Flutterwave from 'flutterwave-node-v3';
import { getOrderByNumber, updateOrderStatus, decrementStock } from '@/lib/sheets';
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNumber = searchParams.get('orderNumber');
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transaction_id');
    const txRef = searchParams.get('tx_ref');

    logPayment('callback:received', { orderNumber, status, transactionId, txRef });

    if (!orderNumber) {
      return NextResponse.redirect(new URL('/checkout?error=missing_order', request.url));
    }

    // Get order
    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      logPayment('callback:orderNotFound', { orderNumber });
      return NextResponse.redirect(new URL('/checkout?error=order_not_found', request.url));
    }

    // If order already paid, just redirect
    if (order.status === 'PAID') {
      logPayment('callback:alreadyPaid', { orderNumber });
      return NextResponse.redirect(new URL(`/order/${orderNumber}`, request.url));
    }

    // If payment was cancelled or failed
    if (status === 'cancelled' || status === 'failed') {
      logPayment('callback:paymentFailed', { orderNumber, status });
      return NextResponse.redirect(
        new URL(`/checkout?error=payment_${status}`, request.url)
      );
    }

    // Verify transaction with Flutterwave
    if (transactionId && status === 'successful') {
      const flw = new Flutterwave(
        process.env.FLW_PUBLIC_KEY || '',
        process.env.FLW_SECRET_KEY || ''
      );

      try {
        const response = await flw.Transaction.verify({ id: transactionId });

        logPayment('callback:verifyResponse', {
          orderNumber,
          transactionId,
          status: response.data?.status,
          amount: response.data?.amount,
        });

        if (
          response.data?.status === 'successful' &&
          (response.data?.amount ?? 0) >= order.totalKes &&
          response.data?.currency === 'KES'
        ) {
          // Payment verified - update order
          await updateOrderStatus(order.id, 'PAID', transactionId.toString());

          // Decrement stock
          for (const item of order.items) {
            await decrementStock(item.variantId, item.qty);
          }

          // Send confirmation email
          await sendPaymentConfirmedEmail({ ...order, status: 'PAID', paymentRef: transactionId.toString() });

          logPayment('callback:paymentVerified', { orderNumber, transactionId });
          return NextResponse.redirect(new URL(`/order/${orderNumber}`, request.url));
        }

        logPayment('callback:verificationFailed', {
          orderNumber,
          transactionId,
          responseStatus: response.data?.status,
          expectedAmount: order.totalKes,
          actualAmount: response.data?.amount,
        });
      } catch (verifyError) {
        logPayment('callback:verifyError', { orderNumber, error: String(verifyError) });
      }
    }

    // Default: redirect to order page (payment pending)
    return NextResponse.redirect(new URL(`/order/${orderNumber}`, request.url));
  } catch (error) {
    logPayment('callback:error', { error: String(error) });
    console.error('Payment callback error:', error);
    return NextResponse.redirect(
      new URL('/checkout?error=callback_error', request.nextUrl.origin)
    );
  }
}
