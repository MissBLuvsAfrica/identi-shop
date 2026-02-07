import { NextRequest, NextResponse } from 'next/server';
import Flutterwave from 'flutterwave-node-v3';
import { getOrderByNumber } from '@/lib/sheets';
import { formatPhoneE164 } from '@/lib/utils';

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

    if (!orderNumber) {
      return NextResponse.redirect(new URL('/checkout', request.url));
    }

    logPayment('init:start', { orderNumber });

    // Get order
    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      logPayment('init:orderNotFound', { orderNumber });
      return NextResponse.redirect(new URL('/checkout?error=order_not_found', request.url));
    }

    // Check if order is already paid
    if (order.status === 'PAID') {
      logPayment('init:alreadyPaid', { orderNumber });
      return NextResponse.redirect(new URL(`/order/${orderNumber}`, request.url));
    }

    // Initialize Flutterwave
    const flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY || '',
      process.env.FLW_SECRET_KEY || ''
    );

    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

    // Create payment payload
    const payload = {
      tx_ref: `${order.id}-${Date.now()}`,
      amount: order.totalKes,
      currency: 'KES',
      redirect_url: `${appBaseUrl}/api/payments/callback?orderNumber=${orderNumber}`,
      customer: {
        email: order.customerEmail,
        phonenumber: formatPhoneE164(order.customerPhone),
        name: order.customerName,
      },
      customizations: {
        title: 'IDENTI',
        description: `Order ${orderNumber}`,
        logo: `${appBaseUrl}/logo.png`,
      },
      meta: {
        order_id: order.id,
        order_number: orderNumber,
      },
    };

    logPayment('init:creatingPaymentLink', { orderNumber, amount: order.totalKes });

    // Create payment link using hosted link
    const response = await flw.Payment.hosted({
      ...payload,
      payment_options: 'card,mpesa,mobilemoneyghana',
    });

    if (response.status === 'success' && response.data?.link) {
      logPayment('init:success', { orderNumber, link: response.data.link });
      return NextResponse.redirect(response.data.link);
    }

    logPayment('init:failed', { orderNumber, response });
    return NextResponse.redirect(
      new URL(`/checkout?error=payment_init_failed`, request.url)
    );
  } catch (error) {
    logPayment('init:error', { error: String(error) });
    console.error('Payment init error:', error);
    return NextResponse.redirect(
      new URL('/checkout?error=payment_error', request.nextUrl.origin)
    );
  }
}
