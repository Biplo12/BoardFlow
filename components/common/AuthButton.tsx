'use client';

import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

const AuthButton: React.FC = (): JSX.Element => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <Link
      href={isAuthenticated ? '/dashboard' : '/signin'}
      className='hidden sm:block'
    >
      <Button disabled={isLoading}>
        {isAuthenticated ? 'Go to Dashboard' : 'Sign in to continue'}
      </Button>
    </Link>
  );
};
export default AuthButton;
