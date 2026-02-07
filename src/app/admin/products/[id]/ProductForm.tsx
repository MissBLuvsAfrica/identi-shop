'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/ui';
import { updateProductAction } from '@/actions/admin';
import type { ProductWithVariants } from '@/types';
import { CATEGORIES } from '@/lib/constants';

interface ProductFormProps {
  product: ProductWithVariants;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProductAction(product.id, formData);
      
      if (result.success) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update product');
      }
    });
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.key,
    label: c.label,
  }));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <h2 className="text-lg font-medium">Product Details</h2>

      <Input
        label="Product Name"
        name="name"
        defaultValue={product.name}
        required
      />

      <Input
        label="SKU"
        name="sku"
        defaultValue={product.sku}
        required
      />

      <Select
        label="Category"
        name="category"
        options={categoryOptions}
        defaultValue={product.category}
        required
      />

      <Input
        label="Price (KES)"
        name="priceKes"
        type="number"
        min="0"
        step="1"
        defaultValue={product.priceKes}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product.description}
          className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
        />
      </div>

      <Input
        label="Image URLs (comma-separated)"
        name="images"
        defaultValue={product.images.join(', ')}
        helperText="Enter image URLs separated by commas"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          value="true"
          defaultChecked={product.isActive}
          className="w-4 h-4"
        />
        <label className="text-sm">Active (visible on store)</label>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 text-sm rounded">
          Product updated successfully!
        </div>
      )}

      <Button type="submit" loading={isPending}>
        UPDATE PRODUCT
      </Button>
    </form>
  );
}
