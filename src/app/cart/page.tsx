import Link from 'next/link';
import { getCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { CartItems } from './CartItems';

export const metadata = {
  title: 'Cart',
  description: 'Review your shopping bag',
};

export default async function CartPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-light mb-4">YOUR BAG IS EMPTY</h1>
        <p className="text-gray-600 mb-8">
          Looks like you haven&apos;t added anything to your bag yet.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-light mb-12 text-center">YOUR BAG</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <CartItems items={cart.items} />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-6">ORDER SUMMARY</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-medium">
                <span>Estimated Total</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-center py-4 hover:bg-gray-800 transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>

            <Link
              href="/shop"
              className="block w-full text-center py-4 text-sm text-gray-600 hover:text-black transition-colors mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
