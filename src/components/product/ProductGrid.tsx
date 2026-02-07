import type { ProductWithVariants } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: ProductWithVariants[];
  title?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  title,
  emptyMessage = 'No products found',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="text-2xl font-light tracking-wide mb-8 text-center">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
