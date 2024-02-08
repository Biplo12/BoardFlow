'use client';

import { useOrganization, UserButton } from '@clerk/nextjs';
import React from 'react';

import InviteButton from '@/components/Layout/Navbar/Partials/InviteButton';
import SearchInput from '@/components/Layout/Navbar/Partials/SearchInput';
import OrgSwitcher from '@/components/Layout/OrganizationSidebar/Partials/OrgSwitcher';

const Navbar: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();

  return (
    <nav className='flex items-center gap-4 p-5'>
      <SearchInput />
      <div className='block flex-1 lg:hidden'>
        <OrgSwitcher />
      </div>
      {organization && <InviteButton />}
      <UserButton />
    </nav>
  );
};
export default Navbar;
