import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { ConvexClientProvider } from '@/providers/convex-client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BoardFlow',
  description:
    'BoardFlow is a app for managing your board workflows with real-time collaboration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
