'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { updateCartItemAction, removeFromCartAction } from '@/actions/cart';
import { MAX_CART_ITEM_QTY } from '@/lib/constants';

interface CartItemsProps {
  items: CartItem[];
}

export function CartItems({ items: initialItems }: CartItemsProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  const handleQuantityChange = (variantId: string, newQty: number) => {
    if (newQty < 0 || newQty > MAX_CART_ITEM_QTY) return;

    setLoadingItem(variantId);
    startTransition(async () => {
      const result = await updateCartItemAction({ variantId, qty: newQty });
      if (result.success && result.data) {
        setItems(result.data.items);
      }
      setLoadingItem(null);
    });
  };

  const handleRemove = (variantId: string) => {
    setLoadingItem(variantId);
    startTransition(async () => {
      const result = await removeFromCartAction(variantId);
      if (result.success && result.data) {
        setItems(result.data.items);
      }
      setLoadingItem(null);
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Your bag is empty</p>
        <Link href="/shop" className="text-black underline hover:no-underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {items.map((item) => (
        <div
          key={item.variantId}
          className={`py-6 flex gap-6 ${loadingItem === item.variantId ? 'opacity-50' : ''}`}
        >
          {/* Image */}
          <Link href={`/product/${item.productId}`} className="flex-shrink-0">
            <div className="relative w-24 h-32 bg-gray-100">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </Link>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link href={`/product/${item.productId}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {item.color}
                {item.size && ` | Size: ${item.size}`}
              </p>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              {/* Quantity */}
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => handleQuantityChange(item.variantId, item.qty - 1)}
                  disabled={isPending || item.qty <= 1}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center">{item.qty}</span>
                <button
                  onClick={() => handleQuantityChange(item.variantId, item.qty + 1)}
                  disabled={isPending || item.qty >= MAX_CART_ITEM_QTY}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* Price & Remove */}
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.unitPriceKes * item.qty)}</p>
                <button
                  onClick={() => handleRemove(item.variantId)}
                  disabled={isPending}
                  className="text-sm text-gray-500 hover:text-black mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
