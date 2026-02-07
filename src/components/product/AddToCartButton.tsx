'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui';
import { addToCartAction } from '@/actions/cart';
import type { Variant, ProductWithVariants } from '@/types';

interface AddToCartButtonProps {
  product: ProductWithVariants;
  selectedVariant: Variant | null;
}

export function AddToCartButton({ product, selectedVariant }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      setMessage({ type: 'error', text: 'Please select a variant' });
      return;
    }

    if (selectedVariant.stock === 0) {
      setMessage({ type: 'error', text: 'This item is out of stock' });
      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id,
        variantId: selectedVariant.id,
        qty: 1,
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Added to cart!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add to cart' });
      }
    });
  };

  const isDisabled = !selectedVariant || selectedVariant.stock === 0;

  return (
    <div className="space-y-3">
      <Button
        onClick={handleAddToCart}
        loading={isPending}
        disabled={isDisabled}
        className="w-full"
        size="lg"
      >
        {isDisabled ? 'SELECT OPTIONS' : 'ADD TO BAG'}
      </Button>

      {message && (
        <p
          className={`text-sm text-center ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
