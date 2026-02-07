import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-light mb-4">Product Not Found</h1>
      <p className="text-gray-600 mb-8">
        The product you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/admin/products"
        className="text-blue-600 hover:underline"
      >
        Back to Products
      </Link>
    </div>
  );
}
