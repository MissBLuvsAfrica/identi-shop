'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/ui';
import { processCheckoutAction, processWhatsAppOrderAction } from '@/actions/checkout';
import type { DeliveryLocation, PaymentMethod } from '@/types';
import { formatPrice, generateWhatsAppLink, calculateTotal } from '@/lib/utils';
import { PAYMENT_METHODS, RETURNS_POLICY } from '@/lib/constants';

interface CheckoutFormProps {
  deliveryLocations: DeliveryLocation[];
  cartSubtotal: number;
  whatsappE164: string;
}

export function CheckoutForm({ deliveryLocations, cartSubtotal, whatsappE164 }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryLocationKey: '',
    deliveryAddress: '',
    paymentMethod: 'POD' as PaymentMethod,
    notes: '',
  });

  const selectedLocation = deliveryLocations.find(
    (l) => l.locationKey === formData.deliveryLocationKey
  );
  const deliveryFee = selectedLocation?.feeKes || 0;
  const total = calculateTotal(cartSubtotal, deliveryFee);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    startTransition(async () => {
      const result = await processCheckoutAction(formDataObj);

      if (!result.success) {
        setError(result.error || 'Checkout failed');
        return;
      }

      // If payment requires redirect (gateway payment)
      if (result.data?.redirectUrl) {
        router.push(result.data.redirectUrl);
        return;
      }

      // Success - redirect to confirmation
      router.push(`/order/${result.data?.orderNumber}`);
    });
  };

  const handleWhatsAppOrder = () => {
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    startTransition(async () => {
      const result = await processWhatsAppOrderAction(formDataObj);

      if (!result.success) {
        setError(result.error || 'Order failed');
        return;
      }

      // Open WhatsApp
      const phone = whatsappE164.replace(/^\+/, '');
      const message = decodeURIComponent(result.data?.whatsappPrefill || '');
      window.open(generateWhatsAppLink(phone, message), '_blank');

      // Redirect to confirmation
      router.push(`/order/${result.data?.orderNumber}`);
    });
  };

  const locationOptions = deliveryLocations.map((l) => ({
    value: l.locationKey,
    label: `${l.label} (${formatPrice(l.feeKes)} - ${l.etaDays} days)`,
  }));

  const paymentOptions = PAYMENT_METHODS.map((m) => ({
    value: m.key,
    label: m.label,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div>
        <h2 className="text-lg font-medium mb-4">CONTACT INFORMATION</h2>
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
          <Input
            label="Phone Number"
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
            placeholder="07XX XXX XXX"
            helperText="We'll use this for delivery updates"
          />
        </div>
      </div>

      {/* Delivery */}
      <div>
        <h2 className="text-lg font-medium mb-4">DELIVERY</h2>
        <div className="space-y-4">
          <Select
            label="Delivery Location"
            name="deliveryLocationKey"
            value={formData.deliveryLocationKey}
            onChange={handleChange}
            options={locationOptions}
            placeholder="Select your location"
            required
          />
          {selectedLocation && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3">
              <p>
                <strong>Delivery Fee:</strong> {formatPrice(selectedLocation.feeKes)}
              </p>
              <p>
                <strong>Estimated Delivery:</strong> {selectedLocation.etaDays} business days
              </p>
            </div>
          )}
          <Input
            label="Delivery Address"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
            placeholder="Street address, building, floor, etc."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none"
              placeholder="Any special instructions for your order"
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <h2 className="text-lg font-medium mb-4">PAYMENT METHOD</h2>
        <Select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={paymentOptions}
          required
        />
        {formData.paymentMethod !== 'POD' && (
          <p className="text-sm text-gray-600 mt-2">
            You&apos;ll be redirected to complete payment securely via Flutterwave.
          </p>
        )}
      </div>

      {/* Order Total */}
      <div className="bg-black text-white p-6">
        <div className="flex justify-between text-lg">
          <span>Order Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 text-sm">{error}</div>
      )}

      {/* Policy Reminder */}
      <p className="text-sm text-gray-500 text-center">
        {RETURNS_POLICY.summary}
      </p>

      {/* Submit Buttons */}
      <div className="space-y-4">
        <Button type="submit" loading={isPending} className="w-full" size="lg">
          {formData.paymentMethod === 'POD' ? 'PLACE ORDER' : 'PROCEED TO PAYMENT'}
        </Button>

        <button
          type="button"
          onClick={handleWhatsAppOrder}
          disabled={isPending || !formData.customerName || !formData.deliveryLocationKey}
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          ORDER VIA WHATSAPP
        </button>
      </div>
    </form>
  );
}
