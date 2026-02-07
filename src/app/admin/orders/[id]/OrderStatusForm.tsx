'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Select } from '@/components/ui';
import { updateOrderStatusAction } from '@/actions/admin';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS } from '@/lib/constants';

interface OrderStatusFormProps {
  order: Order;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING_PAYMENT', label: ORDER_STATUS_LABELS.PENDING_PAYMENT },
  { value: 'PAID', label: ORDER_STATUS_LABELS.PAID },
  { value: 'PAY_ON_DELIVERY', label: ORDER_STATUS_LABELS.PAY_ON_DELIVERY },
  { value: 'PROCESSING', label: ORDER_STATUS_LABELS.PROCESSING },
  { value: 'DELIVERED', label: ORDER_STATUS_LABELS.DELIVERED },
  { value: 'CANCELLED', label: ORDER_STATUS_LABELS.CANCELLED },
];

export function OrderStatusForm({ order }: OrderStatusFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('orderId', order.id);
    formData.append('status', status);

    startTransition(async () => {
      const result = await updateOrderStatusAction(formData);
      
      if (result.success) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update status');
      }
    });
  };

  const canUpdateTo = (newStatus: OrderStatus): boolean => {
    // Logic for valid status transitions
    if (order.status === 'CANCELLED') return false;
    if (order.status === 'DELIVERED' && newStatus !== 'CANCELLED') return false;
    return true;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as OrderStatus)}
        options={STATUS_OPTIONS.map((opt) => ({
          ...opt,
          disabled: !canUpdateTo(opt.value),
        }))}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-2 text-sm rounded">{error}</div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-2 text-sm rounded">
          Status updated!
        </div>
      )}

      <Button
        type="submit"
        loading={isPending}
        disabled={status === order.status}
        size="sm"
        className="w-full"
      >
        UPDATE STATUS
      </Button>

      {order.status === 'PAY_ON_DELIVERY' && (
        <p className="text-xs text-gray-500">
          Mark as DELIVERED after customer pays on delivery.
        </p>
      )}
    </form>
  );
}
