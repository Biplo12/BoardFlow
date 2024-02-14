/* eslint-disable @next/next/no-img-element */
'use client';

import Hero from '@/components/Home/Hero';

export default function MainPage(): JSX.Element {
  return (
    <div className='relative flex h-screen w-full overflow-hidden px-6'>
      <img
        src='/images/home/dot-grid.png'
        alt='dot grid'
        className='absolute bottom-0 left-0 z-40 scale-150 object-cover'
      />
      <img
        src='/images/home/hero-bg.png'
        alt='hero bg'
        className='absolute left-0 top-16 z-40 h-full w-full object-cover'
      />

      <Hero />
    </div>
  );
}
