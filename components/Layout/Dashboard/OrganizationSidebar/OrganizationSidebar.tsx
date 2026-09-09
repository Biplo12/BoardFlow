'use client';
import { LayoutDashboard, Star } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import Logo from '@/components/common/Logo';
import OrgSwitcher from '@/components/Layout/Dashboard/OrganizationSidebar/Partials/OrgSwitcher';

const OrganizationSidebar: React.FC = (): JSX.Element => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get('favorites');

  return (
    <div className='hidden w-[228px] flex-col gap-5 pt-6 pl-5 lg:flex'>
      <Logo />
      <OrgSwitcher />
      <div className='flex w-full flex-col gap-2'>
        <Link href='/dashboard' className='rail-link' data-active={!favorites}>
          <LayoutDashboard className='h-[18px] w-[18px]' />
          Team boards
        </Link>
        <Link
          href={{ pathname: '/dashboard', query: { favorites: true } }}
          className='rail-link'
          data-active={Boolean(favorites)}
        >
          <Star className='h-[18px] w-[18px]' />
          Favorite boards
        </Link>
      </div>
    </div>
  );
};
export default OrganizationSidebar;
