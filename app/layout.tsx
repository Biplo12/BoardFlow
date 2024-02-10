import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

import DialogController from '@/components/Dialogs/DialogController';
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
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
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
          <ConvexClientProvider>
            <Toaster />
            <DialogController />
            {children}
          </ConvexClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
