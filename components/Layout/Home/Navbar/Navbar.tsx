'use client';

import React from 'react';

import AuthButton from '@/components/common/AuthButton';
import Logo from '@/components/common/Logo';

const Navbar: React.FC = (): JSX.Element => {
  return (
    <div className='fixed left-0 top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm sm:px-8'>
      <Logo />
      <AuthButton />
    </div>
  );
};
export default Navbar;
