'use client';

import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import React from 'react';

import StartButton from '@/components/common/StartButton';

const ContactActions: React.FC = (): JSX.Element => {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:items-center'>
      <StartButton />
      {!isAuthenticated && (
        <Link
          href='/login'
          className='flex h-14 items-center justify-center rounded-[22px] px-6 text-[17px] font-semibold text-white/70 transition-colors hover:text-white'
        >
          I already have an account
        </Link>
      )}
    </div>
  );
};
export default ContactActions;
