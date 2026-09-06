'use client';

import { Menu } from 'lucide-react';
import React from 'react';

import AuthButton from '@/components/common/AuthButton';
import Logo from '@/components/common/Logo';

const navItems = [
  {
    name: 'Home',
    href: '#home',
  },
  {
    name: 'About',
    href: '#about',
  },
  {
    name: 'Contact',
    href: '#contact',
  },
];

const Navbar: React.FC = (): JSX.Element => {
  return (
    <div className='fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm sm:px-6'>
      <Logo />
      <div className='hidden gap-4 px-2 sm:flex'>
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className='text-muted-foreground hover:text-foreground'
          >
            {item.name}
          </a>
        ))}
      </div>
      <AuthButton />
      <Menu className='sm:hidden' size={24} />
    </div>
  );
};
export default Navbar;
