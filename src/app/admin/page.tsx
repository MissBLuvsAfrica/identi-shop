import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllOrders, getAllProducts, getAllVariants } from '@/lib/sheets';

export default async function AdminDashboard() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  let orders: Awaited<ReturnType<typeof getAllOrders>> = [];
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let variants: Awaited<ReturnType<typeof getAllVariants>> = [];

  try {
    [orders, products, variants] = await Promise.all([
      getAllOrders(),
      getAllProducts(),
      getAllVariants(),
    ]);
  } catch (error) {
    console.error('Failed to fetch admin data:', error);
  }

  const pendingOrders = orders.filter((o) =>
    o.status === 'PENDING_PAYMENT' || o.status === 'PAY_ON_DELIVERY' || o.status === 'PAID'
  );
  const totalRevenue = orders
    .filter((o) => o.status === 'PAID' || o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.totalKes, 0);
  const lowStockCount = variants.filter(
    (v) => v.isActive && v.stock <= v.lowStockThreshold
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Products</p>
          <p className="text-3xl font-light">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Active Products</p>
          <p className="text-3xl font-light">{products.filter((p) => p.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Low Stock Variants</p>
          <p className="text-3xl font-light">{lowStockCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
          <p className="text-3xl font-light">{pendingOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-light">KES {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium mb-2">Products</h2>
          <p className="text-gray-600 text-sm">Add, edit, and manage product inventory</p>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium mb-2">Orders</h2>
          <p className="text-gray-600 text-sm">View orders and update status</p>
        </Link>
        <Link
          href="/admin/delivery"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium mb-2">Delivery Fees</h2>
          <p className="text-gray-600 text-sm">CRUD delivery fee rows</p>
        </Link>
        <Link
          href="/admin/settings"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium mb-2">Site Settings</h2>
          <p className="text-gray-600 text-sm">Contact info and social handles</p>
        </Link>
        <Link
          href="/admin/settings#payment"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium mb-2">Payment Settings</h2>
          <p className="text-gray-600 text-sm">Toggles and provider (no secrets)</p>
        </Link>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          order.status === 'PAID' || order.status === 'DELIVERED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      KES {order.totalKes.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
