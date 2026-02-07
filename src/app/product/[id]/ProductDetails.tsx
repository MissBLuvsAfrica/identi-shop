'use client';

import { useState } from 'react';
import type { ProductWithVariants, Variant } from '@/types';
import { VariantSelector, AddToCartButton } from '@/components/product';

interface ProductDetailsProps {
  product: ProductWithVariants;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const activeVariants = product.variants.filter((v) => v.isActive);

  if (activeVariants.length === 0) {
    return (
      <div className="p-6 bg-gray-100 text-center">
        <p className="text-gray-600">This product is currently unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <VariantSelector
        variants={activeVariants}
        category={product.category}
        selectedVariant={selectedVariant}
        onSelect={setSelectedVariant}
      />

      <AddToCartButton product={product} selectedVariant={selectedVariant} />
    </div>
  );
}
