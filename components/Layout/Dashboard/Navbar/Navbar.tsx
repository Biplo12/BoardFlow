'use client';

import React from 'react';

import { useOrganization } from '@/hooks/useOrganization';

import UserButton from '@/components/common/UserButton';
import InviteButton from '@/components/Layout/Dashboard/Navbar/Partials/InviteButton';
import SearchInput from '@/components/Layout/Dashboard/Navbar/Partials/SearchInput';
import OrgSwitcher from '@/components/Layout/Dashboard/OrganizationSidebar/Partials/OrgSwitcher';

const Navbar: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();

  return (
    <nav className='flex items-center gap-4 px-5 pt-6 pb-2'>
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
