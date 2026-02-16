import { redirect } from 'next/navigation';
import { getCart } from '@/lib/cart';
import { getDeliveryLocations } from '@/lib/sheets';
import { formatPrice } from '@/lib/utils';
import { WHATSAPP_E164_DEFAULT } from '@/config/contact';
import { CheckoutForm } from './CheckoutForm';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your order',
};

export default async function CheckoutPage() {
  const cart = await getCart();
  let deliveryLocations: Awaited<ReturnType<typeof getDeliveryLocations>> = [];
  try {
    deliveryLocations = await getDeliveryLocations();
  } catch {
    // Build-time or Sheets/OpenSSL errors: proceed with empty locations
  }

  if (cart.items.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light mb-12 text-center">CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <CheckoutForm
            deliveryLocations={deliveryLocations}
            cartSubtotal={cart.subtotal}
            whatsappE164={process.env.WHATSAPP_E164 || WHATSAPP_E164_DEFAULT}
          />
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-6">ORDER SUMMARY</h2>

            {/* Items */}
            <div className="divide-y mb-6">
              {cart.items.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-4">
                  <div className="w-16 h-20 bg-gray-200 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.color}
                      {item.size && ` | ${item.size}`}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.unitPriceKes * item.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-500">Select location</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span id="checkout-total">{formatPrice(cart.subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
