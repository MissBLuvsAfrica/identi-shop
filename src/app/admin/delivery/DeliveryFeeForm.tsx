'use client';

import { useTransition } from 'react';
import { Button, Input } from '@/components/ui';
import { upsertDeliveryAction } from '@/actions/admin';

export function DeliveryFeeForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await upsertDeliveryAction(formData);
      if (result.success) {
        form.reset();
        window.location.reload();
      } else {
        alert(result.error || 'Failed to save');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Location key (e.g. nairobi_cbd)"
        name="locationKey"
        type="text"
        required
        placeholder="nairobi_cbd"
      />
      <Input
        label="Label (e.g. Nairobi CBD)"
        name="label"
        type="text"
        required
        placeholder="Nairobi CBD"
      />
      <Input
        label="Fee (KES)"
        name="feeKes"
        type="number"
        min={0}
        step={1}
        required
        placeholder="300"
      />
      <Input
        label="ETA (e.g. 1-2 days)"
        name="etaDays"
        type="text"
        placeholder="1-2 days"
      />
      <Button type="submit" loading={isPending}>
        Save
      </Button>
    </form>
  );
}
