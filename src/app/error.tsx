'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-light tracking-wide text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          {SITE_NAME} encountered an error. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-black text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 text-sm tracking-wide hover:bg-gray-100 transition-colors inline-block"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
