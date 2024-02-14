/* eslint-disable @next/next/no-img-element */
'use client';

import Hero from '@/components/Home/Hero';

export default function MainPage(): JSX.Element {
  return (
    <div className='relative flex h-screen w-full overflow-hidden'>
      <Hero />
    </div>
  );
}
