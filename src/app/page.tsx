import Link from 'next/link';
import Image from 'next/image';
import { getActiveProductsWithVariants } from '@/lib/sheets';
import { ProductGrid } from '@/components/product';
import { CATEGORIES, SITE_NAME } from '@/lib/constants';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getActiveProductsWithVariants>> = [];
  
  try {
    products = await getActiveProductsWithVariants();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  const featuredProducts = products.slice(0, 8);

  return (
    <div>
      {/* Hero Section - Chanel-inspired full-screen */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Idénti - Luxury Handbags and Shoes"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 text-center">
          <Link
            href="/shop"
            className="inline-block bg-white/95 text-black px-12 py-4 text-sm tracking-[0.25em] font-medium hover:bg-white transition-all duration-300 shadow-lg"
          >
            DISCOVER THE COLLECTION
          </Link>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-light tracking-wide text-center mb-12">SHOP BY CATEGORY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CATEGORIES.map((category) => (
              <Link
                key={category.key}
                href={`/shop?category=${category.key}`}
                className="group relative aspect-[4/3] bg-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center text-white">
                    <h3 className="text-3xl font-light tracking-[0.2em] mb-2">
                      {category.label.toUpperCase()}
                    </h3>
                    <p className="text-sm tracking-wide opacity-80">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid products={featuredProducts} title="FEATURED COLLECTION" />
          {products.length > 8 && (
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-block border border-black px-10 py-4 text-sm tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light tracking-wide mb-8">CRAFTED FOR THE DISCERNING</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            At {SITE_NAME}, we believe that true luxury lies in the details. Each piece in our
            collection is thoughtfully curated to bring you timeless elegance that transcends
            seasons. From the finest materials to impeccable craftsmanship, every item tells a
            story of sophistication.
          </p>
          <Link
            href="/about"
            className="text-sm tracking-widest border-b border-black pb-1 hover:text-gray-600 transition-colors"
          >
            OUR STORY
          </Link>
        </div>
      </section>

      {/* Newsletter / Trust Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-light tracking-wide mb-4">NATIONWIDE DELIVERY</h2>
          <p className="text-gray-400 mb-8">
            We deliver across Kenya. Fast, secure, and reliable shipping to your doorstep.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>M-Pesa & Card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Pay on Delivery</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
