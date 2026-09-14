'use client';

import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import React from 'react';

const AuthButton: React.FC = (): JSX.Element => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <Link
      href={isAuthenticated ? '/dashboard' : '/login'}
      className='candy-button flex h-11 items-center rounded-[18px] px-5 text-[15px] font-semibold text-white'
      style={{
        backgroundColor: 'var(--candy-pink)',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isAuthenticated ? 'Open dashboard' : 'Log in'}
    </Link>
  );
};
export default AuthButton;
