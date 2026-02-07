'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { createVariantAction, updateVariantAction } from '@/actions/admin';
import type { ProductWithVariants, Variant } from '@/types';

interface VariantListProps {
  product: ProductWithVariants;
}

export function VariantList({ product }: VariantListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddVariant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('productId', product.id);

    startTransition(async () => {
      const result = await createVariantAction(formData);
      
      if (result.success) {
        setShowAddForm(false);
        router.refresh();
      } else {
        setError(result.error || 'Failed to add variant');
      }
    });
  };

  const handleUpdateVariant = async (variantId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append('productId', product.id);

    startTransition(async () => {
      const result = await updateVariantAction(variantId, formData);
      
      if (result.success) {
        setEditingVariant(null);
        router.refresh();
      } else {
        setError(result.error || 'Failed to update variant');
      }
    });
  };

  const isShoes = product.category === 'shoes';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Variants ({product.variants.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showAddForm ? 'Cancel' : '+ Add Variant'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm rounded mb-4">{error}</div>
      )}

      {/* Add Variant Form */}
      {showAddForm && (
        <form onSubmit={handleAddVariant} className="border-b pb-6 mb-6 space-y-4">
          <h3 className="font-medium">New Variant</h3>
          
          {isShoes && (
            <Input
              label="Size"
              name="size"
              required
              placeholder="e.g., 38, 39, 40"
            />
          )}

          <Input
            label="Color"
            name="color"
            required
            placeholder="e.g., Black, Brown, Tan"
          />

          <Input
            label="Stock"
            name="stock"
            type="number"
            min="0"
            defaultValue="0"
            required
          />

          <Input
            label="Low Stock Threshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            defaultValue="2"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked
              className="w-4 h-4"
            />
            <label className="text-sm">Active</label>
          </div>

          <Button type="submit" loading={isPending} size="sm">
            ADD VARIANT
          </Button>
        </form>
      )}

      {/* Variants List */}
      {product.variants.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No variants added yet. Add size/color variants to make this product available for purchase.
        </p>
      ) : (
        <div className="space-y-4">
          {product.variants.map((variant) => (
            <div key={variant.id} className="border rounded p-4">
              {editingVariant === variant.id ? (
                <form
                  onSubmit={(e) => handleUpdateVariant(variant.id, e)}
                  className="space-y-4"
                >
                  {isShoes && (
                    <Input
                      label="Size"
                      name="size"
                      defaultValue={variant.size}
                      required
                    />
                  )}

                  <Input
                    label="Color"
                    name="color"
                    defaultValue={variant.color}
                    required
                  />

                  <Input
                    label="Stock"
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={variant.stock}
                    required
                  />

                  <Input
                    label="Low Stock Threshold"
                    name="lowStockThreshold"
                    type="number"
                    min="0"
                    defaultValue={variant.lowStockThreshold}
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      value="true"
                      defaultChecked={variant.isActive}
                      className="w-4 h-4"
                    />
                    <label className="text-sm">Active</label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" loading={isPending} size="sm">
                      SAVE
                    </Button>
                    <button
                      type="button"
                      onClick={() => setEditingVariant(null)}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {isShoes && variant.size && `Size ${variant.size} - `}
                      {variant.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock: {' '}
                      <span
                        className={
                          variant.stock === 0
                            ? 'text-red-600'
                            : variant.stock <= variant.lowStockThreshold
                              ? 'text-orange-600'
                              : 'text-green-600'
                        }
                      >
                        {variant.stock}
                      </span>
                      {!variant.isActive && (
                        <span className="ml-2 text-gray-400">(Inactive)</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingVariant(variant.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
