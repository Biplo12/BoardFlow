'use client';

import { UserButton } from '@clerk/nextjs';
import React from 'react';

const Navbar: React.FC = (): JSX.Element => {
  return (
    <nav className='flex items-center gap-4 bg-green-500 p-5'>
      <div className='hidden lg:flex-1'>{/* Searchbat */}</div>
      <UserButton />
    </nav>
  );
};
export default Navbar;
