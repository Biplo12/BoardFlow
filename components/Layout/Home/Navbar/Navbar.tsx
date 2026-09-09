'use client';

import React from 'react';

import AuthButton from '@/components/common/AuthButton';
import BrandMark from '@/components/common/BrandMark';

const NAV_ITEMS = [
  { name: 'How it works', href: '#how' },
  { name: 'Features', href: '#about' },
  { name: 'Questions', href: '#faq' },
];

const Navbar: React.FC = (): JSX.Element => {
  return (
    <div className='fixed top-0 left-0 z-50 flex w-full justify-center p-3 sm:p-4'>
      <div
        className='flex w-full max-w-[1120px] items-center justify-between rounded-[22px] py-2.5 pr-2.5 pl-4'
        style={{ backgroundColor: 'rgba(255,255,255,0.82)' }}
      >
        <a href='#home' className='group flex items-center gap-2.5'>
          <BrandMark className='h-8 w-8 transition-transform duration-300 group-hover:-rotate-6' />
          <span
            className='text-[18px] font-black tracking-[-0.03em]'
            style={{ color: 'var(--candy-ink)' }}
          >
            BoardFlow
          </span>
        </a>

        <div className='hidden items-center gap-7 md:flex'>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className='nav-link text-[15px] font-semibold'
              style={{ color: 'var(--candy-ink)' }}
            >
              {item.name}
            </a>
          ))}
        </div>

        <AuthButton />
      </div>
    </div>
  );
};
export default Navbar;
