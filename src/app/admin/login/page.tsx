'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { adminLoginAction } from '@/actions/admin';
import { SITE_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await adminLoginAction(formData);
      
      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(result.error || 'Login failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-[0.2em]">{SITE_NAME}</h1>
          <p className="text-gray-600 mt-2">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm rounded-lg space-y-6">
          <Input
            label="Username"
            name="username"
            type="text"
            required
            autoComplete="username"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 text-sm rounded">{error}</div>
          )}

          <Button type="submit" loading={isPending} className="w-full">
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
}
