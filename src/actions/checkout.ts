'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCart, clearCart } from '@/lib/cart';
import {
  createOrder,
  decrementStock,
  getDeliveryLocationByKey,
  checkStockAvailability,
} from '@/lib/sheets';
import { sendOrderReceivedEmail } from '@/lib/email';
import { checkoutSchema } from '@/lib/schemas';
import { calculateSubtotal, calculateTotal } from '@/lib/utils';
import type { ApiResponse, OrderWithItems, PaymentMethod } from '@/types';

// Logging helper
function logCheckout(operation: string, details?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'checkout',
      operation,
      ...details,
    })
  );
}

export interface CheckoutResult {
  orderNumber: string;
  whatsappPrefill: string;
  redirectUrl?: string;
}

export async function processCheckoutAction(
  formData: FormData
): Promise<ApiResponse<CheckoutResult>> {
  try {
    // Parse and validate form data
    const data = {
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
      deliveryLocationKey: formData.get('deliveryLocationKey') as string,
      deliveryAddress: formData.get('deliveryAddress') as string,
      paymentMethod: formData.get('paymentMethod') as PaymentMethod,
      notes: formData.get('notes') as string || '',
    };

    const validated = checkoutSchema.parse(data);

    logCheckout('processCheckout:start', {
      paymentMethod: validated.paymentMethod,
      email: validated.customerEmail,
    });

    // Get cart
    const cart = await getCart();

    if (cart.items.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const { available, currentStock } = await checkStockAvailability(
        item.variantId,
        item.qty
      );

      if (!available) {
        return {
          success: false,
          error: `${item.name} (${item.color}) is ${currentStock === 0 ? 'out of stock' : `only has ${currentStock} available`}`,
        };
      }
    }

    // Get delivery location
    const deliveryLocation = await getDeliveryLocationByKey(validated.deliveryLocationKey);
    if (!deliveryLocation) {
      return { success: false, error: 'Invalid delivery location' };
    }

    // Calculate totals
    const subtotal = calculateSubtotal(cart.items);
    const total = calculateTotal(subtotal, deliveryLocation.feeKes);

    // Determine initial status and payment provider
    const isPOD = validated.paymentMethod === 'POD';
    const isWhatsApp = validated.notes?.includes('WhatsApp order');
    const initialStatus = isPOD ? 'PAY_ON_DELIVERY' : 'PENDING_PAYMENT';
    const paymentProvider = isPOD ? 'NONE' : 'FLUTTERWAVE';

    // Create order
    const order = await createOrder(
      {
        status: initialStatus,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        deliveryLocationKey: validated.deliveryLocationKey,
        deliveryAddress: validated.deliveryAddress,
        deliveryFeeKes: deliveryLocation.feeKes,
        subtotalKes: subtotal,
        totalKes: total,
        paymentMethod: validated.paymentMethod,
        paymentProvider,
        paymentRef: '',
        notes: validated.notes || '',
      },
      cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        sku: item.sku,
        name: item.name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        unitPriceKes: item.unitPriceKes,
        lineTotalKes: item.qty * item.unitPriceKes,
      }))
    );

    logCheckout('processCheckout:orderCreated', {
      orderNumber: order.orderNumber,
      status: order.status,
    });

    // If POD or WhatsApp order, decrement stock immediately
    if (isPOD || isWhatsApp) {
      for (const item of cart.items) {
        await decrementStock(item.variantId, item.qty);
      }
      logCheckout('processCheckout:stockDecremented', { orderNumber: order.orderNumber });
    }

    // Send confirmation email
    await sendOrderReceivedEmail(order);
    logCheckout('processCheckout:emailSent', { orderNumber: order.orderNumber });

    // Clear cart
    await clearCart();
    revalidatePath('/cart');

    // For gateway payments, return redirect URL
    if (!isPOD && !isWhatsApp) {
      // We'll handle this via the payment init API
      return {
        success: true,
        data: {
          orderNumber: order.orderNumber,
          whatsappPrefill: order.whatsappPrefill,
          redirectUrl: `/api/payments/init?orderNumber=${order.orderNumber}`,
        },
      };
    }

    return {
      success: true,
      data: {
        orderNumber: order.orderNumber,
        whatsappPrefill: order.whatsappPrefill,
      },
    };
  } catch (error) {
    logCheckout('processCheckout:error', { error: String(error) });
    console.error('processCheckoutAction error:', error);

    if (error instanceof Error && error.message.includes('validation')) {
      return { success: false, error: 'Please check your details and try again' };
    }

    return { success: false, error: 'Failed to process checkout. Please try again.' };
  }
}

export async function processWhatsAppOrderAction(
  formData: FormData
): Promise<ApiResponse<CheckoutResult>> {
  // Add note to indicate WhatsApp order
  formData.set('notes', 'WhatsApp order');
  formData.set('paymentMethod', 'POD');

  return processCheckoutAction(formData);
}
