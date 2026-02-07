'use client';

import { useState } from 'react';
import type { Variant } from '@/types';

interface VariantSelectorProps {
  variants: Variant[];
  category: 'handbags' | 'shoes';
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

export function VariantSelector({
  variants,
  category,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  // Get unique sizes and colors
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color))];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const showSizes = category === 'shoes' && sizes.length > 0;

  // Get available variants based on selection
  const getAvailableColors = () => {
    if (!showSizes || !selectedSize) {
      return colors;
    }
    return [...new Set(variants.filter((v) => v.size === selectedSize).map((v) => v.color))];
  };

  const getAvailableSizes = () => {
    if (!selectedColor) {
      return sizes;
    }
    return [...new Set(variants.filter((v) => v.color === selectedColor).map((v) => v.size))];
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Find matching variant
    const matchingVariant = variants.find(
      (v) => v.size === size && (selectedColor ? v.color === selectedColor : true) && v.isActive
    );
    if (matchingVariant) {
      onSelect(matchingVariant);
    } else if (selectedColor) {
      // Clear selection if no match
      setSelectedColor(null);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Find matching variant
    if (showSizes && selectedSize) {
      const matchingVariant = variants.find(
        (v) => v.color === color && v.size === selectedSize && v.isActive
      );
      if (matchingVariant) {
        onSelect(matchingVariant);
      }
    } else if (!showSizes) {
      // For handbags, color alone determines the variant
      const matchingVariant = variants.find((v) => v.color === color && v.isActive);
      if (matchingVariant) {
        onSelect(matchingVariant);
      }
    }
  };

  const availableColors = getAvailableColors();
  const availableSizes = getAvailableSizes();

  return (
    <div className="space-y-6">
      {/* Size Selector (for shoes) */}
      {showSizes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Size {selectedSize && <span className="text-gray-400">— {selectedSize}</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = availableSizes.includes(size);
              const isSelected = selectedSize === size;
              const variant = variants.find((v) => v.size === size && v.isActive);
              const inStock = variant ? variant.stock > 0 : false;

              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!isAvailable || !inStock}
                  className={`min-w-[48px] px-4 py-2 border transition-colors ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : isAvailable && inStock
                        ? 'border-gray-200 hover:border-black'
                        : 'border-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Color {selectedColor && <span className="text-gray-400">— {selectedColor}</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isAvailable = availableColors.includes(color);
            const isSelected = selectedColor === color;
            const variant = variants.find(
              (v) =>
                v.color === color &&
                (showSizes ? !selectedSize || v.size === selectedSize : true) &&
                v.isActive
            );
            const inStock = variant ? variant.stock > 0 : false;

            return (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                disabled={!isAvailable || !inStock}
                className={`px-4 py-2 border transition-colors ${
                  isSelected
                    ? 'border-black bg-black text-white'
                    : isAvailable && inStock
                      ? 'border-gray-200 hover:border-black'
                      : 'border-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Status */}
      {selectedVariant && (
        <div className="text-sm">
          {selectedVariant.stock === 0 ? (
            <span className="text-red-600">Out of Stock</span>
          ) : selectedVariant.stock <= selectedVariant.lowStockThreshold ? (
            <span className="text-orange-600">Only {selectedVariant.stock} left</span>
          ) : (
            <span className="text-green-600">In Stock</span>
          )}
        </div>
      )}
    </div>
  );
}
