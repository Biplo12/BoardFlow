'use client';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import React from 'react';

import Logo from '@/components/common/Logo';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

const OrganizationSidebar: React.FC = (): JSX.Element => {
  return (
    <div className='hidden w-[200px] flex-col bg-red-500 pl-5 pt-5 lg:flex'>
      <Link href='/dashboard/organization'>
        <Logo />
      </Link>
    </div>
  );
};
export default OrganizationSidebar;
