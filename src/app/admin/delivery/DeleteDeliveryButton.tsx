'use client';

import { useTransition } from 'react';
import { deleteDeliveryAction } from '@/actions/admin';

interface Props {
  locationKey: string;
}

export function DeleteDeliveryButton({ locationKey }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm(`Delete delivery location "${locationKey}"?`)) return;
    startTransition(async () => {
      const result = await deleteDeliveryAction(locationKey);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error || 'Failed to delete');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
    >
      {isPending ? '…' : 'Delete'}
    </button>
  );
}
