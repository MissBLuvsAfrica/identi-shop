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
    <Link href={`/product/${product.id}`} className="group block touch-manipulation">
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover product-image-hover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg className="w-8 sm:w-12 h-8 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black text-white text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1">
            SOLD OUT
          </div>
        )}

        {/* Quick View Overlay - hidden on mobile */}
        <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors items-end justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-black text-sm px-6 py-3 mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform">
            VIEW PRODUCT
          </span>
        </div>
      </div>

      <div className="mt-2 sm:mt-4 space-y-0.5 sm:space-y-1">
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="font-medium text-sm sm:text-base leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between gap-1">
          <p className="text-gray-900 text-sm sm:text-base">{formatPrice(product.priceKes)}</p>
          <span className={`text-[10px] sm:text-xs ${stockStatus.color} whitespace-nowrap`}>{stockStatus.label}</span>
        </div>
      </div>
    </Link>
  );
}
