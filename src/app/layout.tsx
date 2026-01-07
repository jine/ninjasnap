import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🥷 NinjaSnap - Stealth Screenshot Tool',
  description: 'Take undetectable screenshots of websites with ninja-like precision',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 min-h-screen text-white">{children}</body>
    </html>
  );
}