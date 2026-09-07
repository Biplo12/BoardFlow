import Link from 'next/link';
import React from 'react';

import BrandMark from '@/components/common/BrandMark';
import BrandPattern from '@/components/common/BrandPattern';
import Peep from '@/components/common/Peep';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div
      className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-24'
      style={{ backgroundColor: 'var(--candy-sky)' }}
    >
      <BrandPattern className='absolute inset-0 h-full w-full' />

      <Link
        href='/'
        className='enter-drop group absolute top-6 left-6 z-20 flex items-center gap-2.5 rounded-full py-2 pr-5 pl-2.5 sm:top-8 sm:left-8'
        style={{ backgroundColor: 'rgba(255,255,255,0.72)' }}
      >
        <BrandMark className='h-8 w-8 transition-transform duration-300 group-hover:-rotate-6' />
        <span
          className='text-[17px] font-black tracking-[-0.03em]'
          style={{ color: 'var(--candy-ink)' }}
        >
          BoardFlow
        </span>
      </Link>

      <span
        className='pointer-events-none absolute bottom-0 left-[4%] hidden xl:block'
        style={{ '--enter-delay': '380ms' } as React.CSSProperties}
      >
        <Peep figure='arms-crossed' className='enter-walk h-[300px]' />
      </span>
      <span
        className='pointer-events-none absolute right-[4%] bottom-0 hidden xl:block'
        style={{ '--enter-delay': '480ms' } as React.CSSProperties}
      >
        <Peep figure='easing' className='enter-walk h-[280px]' />
      </span>

      <div className='relative z-10 w-full max-w-[420px]'>{children}</div>

      <Link
        href='/'
        className='relative z-10 mt-6 text-[15px] font-semibold underline underline-offset-4 transition-opacity hover:opacity-60'
        style={{ color: 'var(--candy-ink)' }}
      >
        Back to home
      </Link>
    </div>
  );
}
