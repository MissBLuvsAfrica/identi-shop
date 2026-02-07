import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllProducts, getAllVariants } from '@/lib/sheets';
import { formatPrice } from '@/lib/utils';

export const metadata = {
  title: 'Products',
};

export default async function AdminProductsPage() {
  const authenticated = await isAdminAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }

  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let variants: Awaited<ReturnType<typeof getAllVariants>> = [];

  try {
    [products, variants] = await Promise.all([
      getAllProducts(),
      getAllVariants(),
    ]);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  // Calculate total stock for each product
  const productsWithStock = products.map((product) => {
    const productVariants = variants.filter((v) => v.productId === product.id);
    const totalStock = productVariants.reduce((sum, v) => sum + v.stock, 0);
    const hasLowStock = productVariants.some((v) => v.stock <= v.lowStockThreshold && v.stock > 0);
    const hasNoStock = totalStock === 0;
    return { ...product, totalStock, hasLowStock, hasNoStock, variantCount: productVariants.length };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
        >
          ADD PRODUCT
        </Link>
      </div>

      {productsWithStock.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">No products yet</p>
          <Link
            href="/admin/products/new"
            className="text-blue-600 hover:underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productsWithStock.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatPrice(product.priceKes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm ${
                        product.hasNoStock
                          ? 'text-red-600'
                          : product.hasLowStock
                            ? 'text-orange-600'
                            : 'text-green-600'
                      }`}
                    >
                      {product.totalStock} ({product.variantCount} variants)
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
