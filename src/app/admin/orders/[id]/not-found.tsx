import Link from 'next/link';

export default function OrderNotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-light mb-4">Order Not Found</h1>
      <p className="text-gray-600 mb-8">
        The order you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/admin/orders"
        className="text-blue-600 hover:underline"
      >
        Back to Orders
      </Link>
    </div>
  );
}
