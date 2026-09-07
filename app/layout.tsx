import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/sonner';

import { siteConfig } from '@/constant/config';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { ReduxProvider } from '@/providers/redux-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  manifest: `/favicon/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ReduxProvider>
          <ConvexAuthNextjsServerProvider>
            <ConvexClientProvider>
              <Toaster />
              {children}
            </ConvexClientProvider>
          </ConvexAuthNextjsServerProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
