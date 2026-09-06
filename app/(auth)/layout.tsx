import React from 'react';

import StickerBand from '@/components/auth/StickerBand';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div
      className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-10'
      style={{ backgroundColor: 'var(--candy-sky)' }}
    >
      <div className='relative z-10 w-full max-w-[420px]'>{children}</div>
      <StickerBand />
    </div>
  );
}
