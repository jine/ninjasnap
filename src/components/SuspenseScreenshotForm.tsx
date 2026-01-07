'use client';

import { Suspense } from 'react';

// Concurrent features with Suspense wrapper
export function SuspenseScreenshotForm({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-12 bg-gray-700 rounded mb-4"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
