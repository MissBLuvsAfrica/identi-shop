'use client';

import { useTransition } from 'react';
import { adminLogoutAction } from '@/actions/admin';

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm text-gray-600 hover:text-black disabled:opacity-50"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}
