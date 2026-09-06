/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Backgrounds: React.FC = (): JSX.Element => {
  return (
    <>
      <img
        src='/images/home/hero-bg.png'
        alt='hero bg'
        className='absolute top-16 left-0 z-10 hidden h-full w-full object-cover sm:flex'
      />
      <img
        src='/images/home/hero-bg-mobile.png'
        alt='hero bg'
        className='absolute top-0 left-0 z-10 h-full w-full object-cover sm:hidden'
      />
      <div className='bg-black-10 absolute top-0 left-0 z-20 h-full w-full sm:bg-black/5' />
    </>
  );
};
export default Backgrounds;
