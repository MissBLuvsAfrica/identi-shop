'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: '#f9fafb',
          }}
        >
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                letterSpacing: '0.05em',
                color: '#111',
                marginBottom: '0.5rem',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: '#4b5563',
                fontSize: '0.875rem',
                marginBottom: '2rem',
              }}
            >
              The site encountered an error. Please try again.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Back to home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
