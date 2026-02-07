'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { CATEGORIES } from '@/lib/constants';

interface ShopFiltersProps {
  currentCategory?: string;
  currentSearch?: string;
}

export function ShopFilters({ currentCategory, currentSearch }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch || '');

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/shop?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', search || null);
  };

  const handleCategoryClick = (category: string | null) => {
    updateFilters('category', category);
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-6 py-2 text-sm tracking-wide transition-colors ${
            !currentCategory
              ? 'bg-black text-white'
              : 'border border-gray-200 hover:border-black'
          }`}
        >
          ALL
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.key}
            onClick={() => handleCategoryClick(category.key)}
            className={`px-6 py-2 text-sm tracking-wide transition-colors ${
              currentCategory === category.key
                ? 'bg-black text-white'
                : 'border border-gray-200 hover:border-black'
            }`}
          >
            {category.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 focus:border-black focus:outline-none"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-0 top-0 bottom-0 px-4 hover:bg-gray-100 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isPending ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPending ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              )}
            </svg>
          </button>
        </div>
      </form>

      {/* Active search indicator */}
      {currentSearch && (
        <div className="text-center">
          <span className="text-gray-600">
            Showing results for &quot;{currentSearch}&quot;
          </span>
          <button
            onClick={() => {
              setSearch('');
              updateFilters('search', null);
            }}
            className="ml-2 text-black underline hover:no-underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
