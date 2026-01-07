import type { Metadata } from 'next';
import { lazy, Suspense } from 'react';
import './globals.css';

const ErrorBoundary = lazy(() =>
  import('../components/ErrorBoundary').then((mod) => ({
    default: mod.ErrorBoundary,
  })),
);

const ServiceWorkerRegistration = lazy(() =>
  import('../components/ServiceWorkerRegistration').then((mod) => ({
    default: mod.ServiceWorkerRegistration,
  })),
);

export const metadata: Metadata = {
  title: '🥷 NinjaSnap - Stealth Screenshot Tool',
  description:
    'Take undetectable screenshots of websites with ninja-like precision',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-[#0A0A0A] min-h-screen text-[#FFFFFF]">
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
          <ErrorBoundary>{children}</ErrorBoundary>
          <ServiceWorkerRegistration />
        </Suspense>
      </body>
    </html>
  );
}
