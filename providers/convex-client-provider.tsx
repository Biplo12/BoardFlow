'use client';

import { ConvexAuthNextjsProvider } from '@convex-dev/auth/nextjs';
import { ConvexReactClient } from 'convex/react';

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
};
