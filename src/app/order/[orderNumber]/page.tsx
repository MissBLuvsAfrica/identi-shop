import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/lib/sheets';
import { formatPrice, formatDateTime, generateWhatsAppLink } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, RETURNS_POLICY } from '@/lib/constants';
import { WHATSAPP_E164_DEFAULT } from '@/config/contact';

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    description: 'Order confirmation',
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  let order = null;
  
  try {
    order = await getOrderByNumber(orderNumber);
  } catch (error) {
    console.error('Failed to fetch order:', error);
  }

  if (!order) {
    notFound();
  }

  const whatsappPhone = process.env.WHATSAPP_E164 || WHATSAPP_E164_DEFAULT;
  const whatsappMessage = decodeURIComponent(order.whatsappPrefill);
  const whatsappLink = generateWhatsAppLink(whatsappPhone, whatsappMessage);

  const isPendingPayment = order.status === 'PENDING_PAYMENT';
  const isPaid = order.status === 'PAID';
  const isPOD = order.status === 'PAY_ON_DELIVERY';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-light mb-2">
          {isPaid ? 'Payment Confirmed!' : isPOD ? 'Order Placed!' : 'Order Received!'}
        </h1>
        <p className="text-gray-600">Thank you for your order</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-gray-50 p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-medium">{order.orderNumber}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded ${
              ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Order Date</p>
            <p>{formatDateTime(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Method</p>
            <p>{order.paymentMethod === 'POD' ? 'Pay on Delivery' : order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Pending Payment Notice */}
      {isPendingPayment && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 mb-8">
          <h3 className="font-medium text-yellow-800 mb-2">Payment Pending</h3>
          <p className="text-yellow-700 text-sm">
            Your order is awaiting payment. Please complete your payment to confirm your order.
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">ORDER ITEMS</h2>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.color}
                  {item.size && ` | Size: ${item.size}`} | Qty: {item.qty}
                </p>
              </div>
              <p>{formatPrice(item.lineTotalKes)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-4 mb-8 space-y-2">
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

      {/* Delivery Info */}
      <div className="bg-gray-50 p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">DELIVERY DETAILS</h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-500">Name:</span> {order.customerName}
          </p>
          <p>
            <span className="text-gray-500">Email:</span> {order.customerEmail}
          </p>
          <p>
            <span className="text-gray-500">Phone:</span> {order.customerPhone}
          </p>
          <p>
            <span className="text-gray-500">Address:</span> {order.deliveryAddress}
          </p>
        </div>
      </div>

      {/* Policy */}
      <div className="bg-yellow-50 p-6 mb-8 text-sm">
        <h3 className="font-medium mb-2">{RETURNS_POLICY.title}</h3>
        <p className="text-gray-700">{RETURNS_POLICY.summary}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="flex-1 text-center py-3 border border-black hover:bg-black hover:text-white transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          CHAT WITH US
        </a>
      </div>
    </div>
  );
}
