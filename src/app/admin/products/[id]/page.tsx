import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { getProductById } from '@/lib/sheets';
import { ProductForm } from './ProductForm';
import { VariantList } from './VariantList';

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductEditPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product ? `Edit: ${product.name}` : 'Product Not Found',
  };
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const authenticated = await isAdminAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-gray-600 hover:text-black text-sm">
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl font-light mt-4">Edit Product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Details Form */}
        <div>
          <ProductForm product={product} />
        </div>

        {/* Variants Management */}
        <div>
          <VariantList product={product} />
        </div>
      </div>
    </div>
  );
}
