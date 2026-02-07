import { Suspense } from 'react';
import { getActiveProductsWithVariants } from '@/lib/sheets';
import { ProductGrid } from '@/components/product';
import { CATEGORIES } from '@/lib/constants';
import { ShopFilters } from './ShopFilters';

export const revalidate = 60;

export const metadata = {
  title: 'Shop',
  description: 'Browse our collection of luxury handbags and shoes.',
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

async function ProductList({ category, search }: { category?: string; search?: string }) {
  let products: Awaited<ReturnType<typeof getActiveProductsWithVariants>> = [];
  
  try {
    products = await getActiveProductsWithVariants();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  // Filter by category
  if (category && ['handbags', 'shoes'].includes(category)) {
    products = products.filter((p) => p.category === category);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  return (
    <ProductGrid
      products={products}
      emptyMessage={
        search
          ? `No products found for "${search}"`
          : category
            ? `No ${category} available at the moment`
            : 'No products available'
      }
    />
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;

  const categoryLabel = category
    ? CATEGORIES.find((c) => c.key === category)?.label || 'All Products'
    : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light tracking-wide mb-4">{categoryLabel.toUpperCase()}</h1>
        <p className="text-gray-600">Discover our curated collection</p>
      </div>

      {/* Filters */}
      <ShopFilters currentCategory={category} currentSearch={search} />

      {/* Products */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-200 w-1/3" />
                  <div className="h-4 bg-gray-200 w-2/3" />
                  <div className="h-4 bg-gray-200 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <ProductList category={category} search={search} />
      </Suspense>
    </div>
  );
}
