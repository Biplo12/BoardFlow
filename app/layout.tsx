import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { Archivo, Instrument_Sans } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/sonner';

import { siteConfig } from '@/constant/config';
import { ConvexClientProvider } from '@/providers/convex-client-provider';
import { ReduxProvider } from '@/providers/redux-provider';

const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${display.variable} ${sans.variable} font-sans`}>
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
