import type { Metadata } from 'next';
import { lazy, Suspense } from 'react';
import './globals.css';

const ErrorBoundary = lazy(() =>
  import('../components/ErrorBoundary').then((mod) => ({
    default: mod.ErrorBoundary,
  }))
);

const ServiceWorkerRegistration = lazy(() =>
  import('../components/ServiceWorkerRegistration').then((mod) => ({
    default: mod.ServiceWorkerRegistration,
  }))
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
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Font loading optimization */
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2') format('woff2');
            }
            body {
              font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            /* Critical above-the-fold styles */
            .max-w-md {
              max-width: 28rem;
            }
            .mx-auto {
              margin-left: auto;
              margin-right: auto;
            }
            .mt-20 {
              margin-top: 5rem;
            }
            .p-6 {
              padding: 1.5rem;
            }
            .bg-gray-800 {
              background-color: rgb(31 41 55);
            }
            .rounded-lg {
              border-radius: 0.5rem;
            }
            .shadow-2xl {
              box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
            }
            .border {
              border-width: 1px;
            }
            .border-gray-700 {
              border-color: rgb(55 65 81);
            }
            .text-3xl {
              font-size: 1.875rem;
              line-height: 2.25rem;
            }
            .font-bold {
              font-weight: 700;
            }
            .text-center {
              text-align: center;
            }
            .mb-6 {
              margin-bottom: 1.5rem;
            }
            .text-emerald-400 {
              color: rgb(52 211 153);
            }
          `,
        }} />
      </head>
      <body className="bg-gray-900 min-h-screen text-white">
        <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
          <ErrorBoundary>{children}</ErrorBoundary>
          <ServiceWorkerRegistration />
        </Suspense>
      </body>
    </html>
  );
}
