import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductById } from '@/lib/sheets';
import { formatPrice } from '@/lib/utils';
import { RETURNS_POLICY } from '@/lib/constants';
import { ImageGallery } from '@/components/product';
import { ProductDetails } from './ProductDetails';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product = null;
  
  try {
    product = await getProductById(id);
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-black">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-black capitalize"
            >
              {product.category}
            </Link>
          </li>
          <li>/</li>
          <li className="text-black">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-light mb-4">{product.name}</h1>
            <p className="text-2xl">{formatPrice(product.priceKes)}</p>
          </div>

          {/* Description */}
          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          {/* SKU */}
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>

          {/* Variant Selector & Add to Cart */}
          <ProductDetails product={product} />

          {/* Delivery & Returns Info */}
          <div className="border-t pt-8 space-y-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div>
                <p className="font-medium">Nationwide Delivery</p>
                <p className="text-sm text-gray-500">Delivery fees based on location</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <div>
                <p className="font-medium">{RETURNS_POLICY.title}</p>
                <p className="text-sm text-gray-500">{RETURNS_POLICY.summary}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-gray-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="font-medium">Secure Payments</p>
                <p className="text-sm text-gray-500">M-Pesa, Card, or Pay on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
