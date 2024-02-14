/* eslint-disable @next/next/no-img-element */
import { Poppins } from 'next/font/google';
import React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400'],
});

const Hero: React.FC = (): JSX.Element => {
  return (
    <div
      className={cn(
        'z-40 flex h-full w-full items-center justify-center gap-6 text-black',
        font.className
      )}
    >
      <div className='flex flex-col items-center justify-start gap-3'>
        <img
          src='/images/logo/logo-white-no-bg.png'
          alt='logo'
          className='w-24'
        />
        <h1 className='max-w-[800px] text-center text-5xl font-bold'>
          A digital whiteboard for team collaboration and brainstorming.
        </h1>
        <p className='max-w-[800px] text-center text-lg text-gray-600'>
          Create and share ideas, brainstorm and collaborate with your team in
          real-time.
        </p>
        <div className='flex gap-4'>
          <Button>Get Started</Button>
          <Button variant='outline'>Learn More</Button>
        </div>
      </div>
    </div>
  );
};
export default Hero;
