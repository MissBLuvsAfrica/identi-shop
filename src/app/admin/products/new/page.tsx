'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Select } from '@/components/ui';
import { createProductAction } from '@/actions/admin';
import { CATEGORIES } from '@/lib/constants';

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createProductAction(formData);
      
      if (result.success && result.data) {
        router.push(`/admin/products/${result.data.id}`);
      } else {
        setError(result.error || 'Failed to create product');
      }
    });
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.key,
    label: c.label,
  }));

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/products" className="text-gray-600 hover:text-black text-sm">
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl font-light mt-4">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <Input
          label="Product Name"
          name="name"
          required
          placeholder="e.g., Classic Leather Handbag"
        />

        <Input
          label="SKU"
          name="sku"
          required
          placeholder="e.g., HB-001"
        />

        <Select
          label="Category"
          name="category"
          options={categoryOptions}
          required
        />

        <Input
          label="Price (KES)"
          name="priceKes"
          type="number"
          min="0"
          step="1"
          required
          placeholder="e.g., 5000"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
            placeholder="Product description..."
          />
        </div>

        <Input
          label="Image URLs (comma-separated)"
          name="images"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          helperText="Enter image URLs separated by commas"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked
            className="w-4 h-4"
          />
          <label className="text-sm">Active (visible on store)</label>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm rounded">{error}</div>
        )}

        <div className="flex gap-4">
          <Button type="submit" loading={isPending}>
            CREATE PRODUCT
          </Button>
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-200 hover:border-black transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        After creating the product, you can add size/color variants.
      </p>
    </div>
  );
}
