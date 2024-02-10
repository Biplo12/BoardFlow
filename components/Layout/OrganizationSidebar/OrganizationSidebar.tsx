'use client';
import { LayoutDashboard, Star } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import Logo from '@/components/common/Logo';
import OrgSwitcher from '@/components/Layout/OrganizationSidebar/Partials/OrgSwitcher';
import { Button } from '@/components/ui/button';

const OrganizationSidebar: React.FC = (): JSX.Element => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get('favorites');

  return (
    <div className='hidden w-[200px] flex-col items-center gap-4 pl-5 pt-5 lg:flex'>
      <Logo />
      <OrgSwitcher />
      <div className='flex w-full flex-col gap-2'>
        <Button
          asChild
          size='lg'
          className='w-full justify-start px-2 font-normal'
        >
          <Link href='/' className='flex items-center gap-2'>
            <LayoutDashboard className='h-4 w-4' />
            Team boards
          </Link>
        </Button>
        <Button
          variant={favorites ? 'secondary' : 'ghost'}
          asChild
          size='lg'
          className='w-full justify-start px-2 font-normal'
        >
          <Link
            href={{
              pathname: '/',
              query: { favorites: true },
            }}
            className='flex items-center gap-2'
          >
            <Star className='h-4 w-4' />
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default OrganizationSidebar;
