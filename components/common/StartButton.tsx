'use client';

import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

interface StartButtonProps {
  className?: string;
}

const StartButton: React.FC<StartButtonProps> = ({
  className,
}): JSX.Element => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <Link
      href={isAuthenticated ? '/dashboard' : '/register'}
      className={cn(
        'candy-button flex h-14 items-center justify-center rounded-[22px] px-8 text-[17px] font-semibold whitespace-nowrap text-white',
        className
      )}
      style={{
        backgroundColor: 'var(--candy-pink)',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isAuthenticated ? 'Open your dashboard' : 'Start a board for free'}
    </Link>
  );
};
export default StartButton;
