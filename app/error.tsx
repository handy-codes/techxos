'use client';

import { useEffect } from 'react';

export default function Error({
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <button
        className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
} 