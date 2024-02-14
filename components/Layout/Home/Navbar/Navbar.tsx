'use client';

import React from 'react';

import AuthButton from '@/components/common/AuthButton';
import Logo from '@/components/common/Logo';

const navItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Features',
    href: '/features',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
];

const Navbar: React.FC = (): JSX.Element => {
  return (
    <div className='fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm sm:px-8'>
      <Logo />
      <div className='flex gap-4'>
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className='text-gray-600 hover:text-gray-800'
          >
            {item.name}
          </a>
        ))}
      </div>
      <AuthButton />
    </div>
  );
};
export default Navbar;
