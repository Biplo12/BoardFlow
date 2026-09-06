import React from 'react';

import SectorView from '@/components/auth/SectorView';
import BrandMark from '@/components/common/BrandMark';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div className='bg-background text-foreground relative min-h-screen w-full overflow-hidden'>
      <div className='route-ribbon absolute inset-x-0 top-0 z-20 h-[3px] md:h-1' />

      <div className='sign-band absolute top-6 left-4 z-10 flex h-9 items-center gap-2 rounded-lg px-3 md:top-7 md:left-[72px] md:h-10 md:px-3.5'>
        <BrandMark className='h-4 w-4' />
        <span
          className='font-display text-[11px] font-semibold uppercase'
          style={{ fontStretch: '118%', letterSpacing: '0.08em' }}
        >
          BoardFlow
        </span>
        <span
          className='ml-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase opacity-80'
          style={{ letterSpacing: '0.1em' }}
        >
          <span
            className='block h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: 'hsl(var(--route-cyan))' }}
          />
          Live
        </span>
      </div>

      <div className='mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 content-center items-center gap-6 px-4 pt-20 pb-10 md:grid-cols-12 md:gap-6 md:px-[72px] md:pt-10'>
        <SectorView className='order-1 h-[88px] w-full overflow-hidden rounded-lg md:order-2 md:col-span-6 md:col-start-7 md:h-[460px]' />
        <div className='order-2 w-full md:order-1 md:col-span-5 md:col-start-2'>
          {children}
        </div>
      </div>
    </div>
  );
}
