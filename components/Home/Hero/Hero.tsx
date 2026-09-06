 
import Link from 'next/link';
import React from 'react';

import BrandMark from '@/components/common/BrandMark';
import Backgrounds from '@/components/Home/Hero/Partials/Backgrounds';
import { Button } from '@/components/ui/button';

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
        className='z-40 flex h-full w-full items-center justify-center gap-6 px-6'
        id='home'
      >
        <div className='flex flex-col items-center justify-start gap-3'>
          <BrandMark className='h-20 w-20' />
          <h1 className='max-w-[800px] text-center text-2xl font-bold sm:text-5xl'>
            A digital whiteboard for team collaboration and brainstorming.
          </h1>
          <p className='text-muted-foreground max-w-[800px] text-center text-sm sm:text-lg'>
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
