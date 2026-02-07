import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-4xl font-light mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8">
        The product you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}
