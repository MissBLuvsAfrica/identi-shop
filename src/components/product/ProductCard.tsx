import Link from 'next/link';
import Image from 'next/image';
import type { ProductWithVariants } from '@/types';
import { formatPrice, getStockStatus } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const stockStatus = getStockStatus(totalStock);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover product-image-hover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Stock Badge */}
        {totalStock === 0 && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs px-3 py-1">
            SOLD OUT
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-black text-sm px-6 py-3 mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            VIEW PRODUCT
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-medium">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-900">{formatPrice(product.priceKes)}</p>
          <span className={`text-xs ${stockStatus.color}`}>{stockStatus.label}</span>
        </div>
      </div>
    </Link>
  );
}
