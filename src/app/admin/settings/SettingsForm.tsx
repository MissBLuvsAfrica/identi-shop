'use client';

import { useTransition } from 'react';
import { Button, Input } from '@/components/ui';
import { updateSettingsAction } from '@/actions/admin';
import type { SiteSettings } from '@/lib/settings';

interface Props {
  initialSettings: SiteSettings | null;
}

export function SettingsForm({ initialSettings }: Props) {
  const [isPending, startTransition] = useTransition();
  const s = initialSettings ?? {
    contact_email: '',
    contact_phone_display: '',
    contact_phone_e164: '',
    instagram_handle: '',
    tiktok_handle: '',
    whatsapp_e164: '',
    payments_enabled: true,
    pay_on_delivery_enabled: true,
    payment_provider: 'flutterwave',
    checkout_whatsapp_template: '',
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('payments_enabled', form.payments_enabled.checked ? 'true' : 'false');
    formData.set('pay_on_delivery_enabled', form.pay_on_delivery_enabled.checked ? 'true' : 'false');
    startTransition(async () => {
      const result = await updateSettingsAction(formData);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || 'Failed to update settings');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <section id="contact" className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Contact & Social</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact email"
            name="contact_email"
            type="email"
            defaultValue={s.contact_email}
            placeholder="hello@identionline.com"
          />
          <Input
            label="Phone (display)"
            name="contact_phone_display"
            type="text"
            defaultValue={s.contact_phone_display}
            placeholder="0716610156"
          />
          <Input
            label="Phone (E164)"
            name="contact_phone_e164"
            type="text"
            defaultValue={s.contact_phone_e164}
            placeholder="+254716610156"
          />
          <Input
            label="Instagram handle"
            name="instagram_handle"
            type="text"
            defaultValue={s.instagram_handle}
            placeholder="shopidenti"
          />
          <Input
            label="TikTok handle"
            name="tiktok_handle"
            type="text"
            defaultValue={s.tiktok_handle}
            placeholder="shopidenti"
          />
          <Input
            label="WhatsApp (E164, no +)"
            name="whatsapp_e164"
            type="text"
            defaultValue={s.whatsapp_e164}
            placeholder="254716610156"
          />
        </div>
      </section>

      <section id="payment" className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Payment (toggles only; no secrets)</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="payments_enabled"
              defaultChecked={s.payments_enabled}
              className="rounded border-gray-300"
            />
            <span>Payments enabled (gateway)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="pay_on_delivery_enabled"
              defaultChecked={s.pay_on_delivery_enabled}
              className="rounded border-gray-300"
            />
            <span>Pay on Delivery enabled</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment provider
            </label>
            <select
              name="payment_provider"
              defaultValue={s.payment_provider}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            >
              <option value="flutterwave">flutterwave</option>
              <option value="none">none</option>
            </select>
          </div>
          <Input
            label="Checkout WhatsApp template (optional)"
            name="checkout_whatsapp_template"
            type="text"
            defaultValue={s.checkout_whatsapp_template}
            placeholder="Optional message template"
          />
        </div>
      </section>

      <Button type="submit" loading={isPending}>
        Save settings
      </Button>
    </form>
  );
}
