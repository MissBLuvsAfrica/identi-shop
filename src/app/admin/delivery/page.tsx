import Link from 'next/link';
import { getDeliveryLocations } from '@/lib/sheets';
import { formatPrice } from '@/lib/utils';
import { DeliveryFeeForm } from './DeliveryFeeForm';
import { DeleteDeliveryButton } from './DeleteDeliveryButton';

export default async function AdminDeliveryPage() {
  let locations: Awaited<ReturnType<typeof getDeliveryLocations>> = [];
  try {
    locations = await getDeliveryLocations();
  } catch (error) {
    console.error('Failed to fetch delivery locations:', error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light">Delivery Fees</h1>
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Add / Edit location</h2>
          <DeliveryFeeForm />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-lg font-medium p-6 pb-4">Current delivery fees</h2>
          {locations.length === 0 ? (
            <p className="px-6 pb-6 text-gray-500">No delivery locations yet. Add one above.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Key
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Label
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Fee
                  </th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ETA
                  </th>
                  <th className="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {locations.map((loc) => (
                  <tr key={loc.locationKey}>
                    <td className="px-6 py-3 text-sm">{loc.locationKey}</td>
                    <td className="px-6 py-3 text-sm">{loc.label}</td>
                    <td className="px-6 py-3 text-sm">{formatPrice(loc.feeKes)}</td>
                    <td className="px-6 py-3 text-sm">{loc.etaDays}</td>
                    <td className="px-6 py-3 text-right">
                      <DeleteDeliveryButton locationKey={loc.locationKey} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
