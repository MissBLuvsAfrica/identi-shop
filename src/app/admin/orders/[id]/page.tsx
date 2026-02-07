import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { isAdminAuthenticated } from '@/lib/auth';
import { getOrderById } from '@/lib/sheets';
import { formatPrice, formatDateTime, generateWhatsAppLink } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { OrderStatusForm } from './OrderStatusForm';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  return {
    title: order ? `Order: ${order.orderNumber}` : 'Order Not Found',
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const authenticated = await isAdminAuthenticated();
  
  if (!authenticated) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const whatsappPhone = process.env.WHATSAPP_E164 || '254700000000';
  const whatsappLink = generateWhatsAppLink(
    whatsappPhone,
    `Hi! Regarding order ${order.orderNumber}...`
  );

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/orders" className="text-gray-600 hover:text-black text-sm">
          &larr; Back to Orders
        </Link>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-light">{order.orderNumber}</h1>
          <span
            className={`px-3 py-1 text-sm rounded ${
              ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
        <p className="text-gray-600 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.color}
                      {item.size && ` | Size: ${item.size}`} | Qty: {item.qty}
                    </p>
                    <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.lineTotalKes)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.subtotalKes)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span>{formatPrice(order.deliveryFeeKes)}</span>
              </div>
              <div className="flex justify-between text-lg font-medium border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(order.totalKes)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Method</p>
                <p>{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Provider</p>
                <p>{order.paymentProvider}</p>
              </div>
              {order.paymentRef && (
                <div className="col-span-2">
                  <p className="text-gray-500">Reference</p>
                  <p className="font-mono text-xs">{order.paymentRef}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Order Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p>{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <a href={`mailto:${order.customerEmail}`} className="text-blue-600 hover:underline">
                  {order.customerEmail}
                </a>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                  {order.customerPhone}
                </a>
              </div>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message on WhatsApp
            </a>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Delivery</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Location</p>
                <p>{order.deliveryLocationKey}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p>{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-gray-500">Fee</p>
                <p>{formatPrice(order.deliveryFeeKes)}</p>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Update Status</h2>
            <OrderStatusForm order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
