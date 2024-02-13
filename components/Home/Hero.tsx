/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Hero: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full items-center justify-center gap-6 bg-neutral-100 px-8'>
      <div className='flex flex-col items-start justify-start gap-3'>
        <h1 className='text-5xl font-bold text-blue-950'>
          Welcome to BoardFlow{' '}
          <span role='img' aria-label='wave emoji'>
            👋
          </span>
        </h1>
        <div className='fle flex-col gap-2'>
          <h2 className='text-xl text-neutral-800'>
            The{' '}
            <span className='font-semibold text-[#6F4CFF]'>
              interactive real-time board
            </span>{' '}
            for remote teams.
          </h2>
          <h3 className='text-sm text-neutral-700'>
            Create, collaborate and share ideas with your team.
          </h3>
          <h3 className='text-sm text-neutral-700'>
            Get started by creating a new board or joining an existing one.
          </h3>
        </div>
      </div>
      <div className=''>
        <img
          src='/images/home/boards-bg.png'
          alt='boards'
          className='w-[1000px]'
        />
      </div>
    </div>
  );
};
export default Hero;
