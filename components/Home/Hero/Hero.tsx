/* eslint-disable @next/next/no-img-element */
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

import Backgrounds from '@/components/Home/Hero/Partials/Backgrounds';
import { Button } from '@/components/ui/button';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400'],
});

const Hero: React.FC = (): JSX.Element => {
  return (
    <div
      className='relative flex h-screen w-full overflow-hidden'
      style={{
        backgroundImage: 'url(/images/home/dot-grid.png)',
        backgroundSize: 'cover',
      }}
    >
      <Backgrounds />
      <div
        className={cn(
          'z-40 flex h-full w-full items-center justify-center gap-6 px-6 text-black',
          font.className
        )}
        id='home'
      >
        <div className='flex flex-col items-center justify-start gap-3'>
          <img
            src='/images/logo/logo-white-no-bg.png'
            alt='logo'
            className='w-24'
          />
          <h1 className='max-w-[800px] text-center text-2xl font-bold sm:text-5xl'>
            A digital whiteboard for team collaboration and brainstorming.
          </h1>
          <p className='max-w-[800px] text-center text-sm text-gray-600 sm:text-lg'>
            Create and share ideas, brainstorm and collaborate with your team in
            real-time.
          </p>
          <div className='flex gap-4'>
            <Link href='/dashboard'>
              <Button>Get Started</Button>
            </Link>
            <Link href='#about'>
              <Button variant='outline'>Learn More</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
