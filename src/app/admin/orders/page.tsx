import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllOrders } from '@/lib/sheets';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';

export const metadata = {
  title: 'Orders',
};

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const authenticated = await isAdminAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const statusFilter = params.status;

  let orders: Awaited<ReturnType<typeof getAllOrders>> = [];

  try {
    orders = await getAllOrders();
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }

  // Sort by created date (newest first)
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter by status if specified
  if (statusFilter) {
    orders = orders.filter((o) => o.status === statusFilter);
  }

  const statuses = [
    'PENDING_PAYMENT',
    'PAID',
    'PAY_ON_DELIVERY',
    'PROCESSING',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Orders</h1>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/orders"
          className={`px-4 py-2 text-sm border transition-colors ${
            !statusFilter ? 'bg-black text-white' : 'border-gray-200 hover:border-black'
          }`}
        >
          All ({orders.length})
        </Link>
        {statuses.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <Link
              key={status}
              href={`/admin/orders?status=${status}`}
              className={`px-4 py-2 text-sm border transition-colors ${
                statusFilter === status
                  ? 'bg-black text-white'
                  : 'border-gray-200 hover:border-black'
              }`}
            >
              {ORDER_STATUS_LABELS[status]} ({count})
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {formatPrice(order.totalKes)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
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
