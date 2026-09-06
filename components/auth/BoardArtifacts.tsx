import React from 'react';

import { cn } from '@/lib/utils';

const INK = 'rgba(0,18,52,0.28)';
const INK_SOFT = 'rgba(0,18,52,0.16)';

const Checklist = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect width='92' height='92' rx='14' fill='var(--candy-butter)' />
    <g stroke={INK} strokeWidth='3.5' strokeLinecap='round' fill='none'>
      <rect x='14' y='20' width='14' height='14' rx='4' />
      <path d='M17 27l4 4 7-8' />
      <rect x='14' y='44' width='14' height='14' rx='4' />
      <rect x='14' y='68' width='14' height='14' rx='4' />
      <path d='M36 27h40M36 51h32M36 75h38' strokeWidth='4' />
    </g>
  </svg>
);

const Doodle = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect width='92' height='92' rx='14' fill='var(--candy-pink)' />
    <path
      d='M46 16l8.5 20.5L76 38l-16 14 5 22-19-11.5L27 74l5-22-16-14 21.5-1.5Z'
      fill='none'
      stroke='#fff'
      strokeWidth='4.5'
      strokeLinejoin='round'
    />
  </svg>
);

const Chart = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect width='92' height='92' rx='14' fill='var(--candy-lime)' />
    <g fill={INK}>
      <rect x='16' y='50' width='13' height='26' rx='4' />
      <rect x='36' y='34' width='13' height='42' rx='4' />
      <rect x='56' y='20' width='13' height='56' rx='4' />
    </g>
    <path
      d='M16 40 36 26 56 30 74 14'
      fill='none'
      stroke='#fff'
      strokeWidth='4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const Photo = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect width='92' height='92' rx='14' fill='var(--candy-violet)' />
    <circle cx='30' cy='30' r='9' fill='#fff' opacity='0.9' />
    <path
      d='M8 76 34 46l16 15 12-11 22 26v2a12 12 0 0 1-12 0H8Z'
      fill='rgba(255,255,255,0.55)'
    />
    <path d='M8 76 34 46l16 15 12-11 22 26Z' fill='rgba(0,18,52,0.22)' />
  </svg>
);

const Flow = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect width='92' height='92' rx='14' fill='#ffffff' />
    <g fill={INK_SOFT}>
      <rect x='12' y='14' width='30' height='18' rx='6' />
      <rect x='50' y='40' width='30' height='18' rx='6' />
      <rect x='12' y='64' width='30' height='16' rx='6' />
    </g>
    <g stroke={INK} strokeWidth='3' fill='none' strokeLinecap='round'>
      <path d='M42 23h14a6 6 0 0 1 6 6v7' />
      <path d='M50 49H33a6 6 0 0 0-6 6v7' />
      <path d='M59 32l3 5 3-5' strokeLinejoin='round' />
      <path d='M24 59l3 5 3-5' strokeLinejoin='round' />
    </g>
  </svg>
);

const Cursor = () => (
  <svg viewBox='0 0 92 62' className='h-full w-full'>
    <path
      d='M6 4 6 40 16 31 22 50 32 46 25 28 41 26Z'
      fill='#fff'
      stroke='rgba(0,18,52,0.32)'
      strokeWidth='3.5'
      strokeLinejoin='round'
    />
    <rect
      x='34'
      y='30'
      width='54'
      height='26'
      rx='13'
      fill='var(--candy-pink)'
    />
    <path
      d='M46 43h30'
      stroke='#fff'
      strokeWidth='5'
      strokeLinecap='round'
      opacity='0.9'
    />
  </svg>
);

const ARTIFACTS = [
  {
    key: 'checklist',
    Art: Checklist,
    className: 'left-[5%] bottom-[12%] h-24 w-24 rotate-[-9deg]',
    float: '7s',
    delay: '0s',
  },
  {
    key: 'doodle',
    Art: Doodle,
    className: 'right-[7%] bottom-[16%] h-28 w-28 rotate-[8deg]',
    float: '9s',
    delay: '-2s',
  },
  {
    key: 'chart',
    Art: Chart,
    className: 'left-[13%] top-[14%] hidden h-24 w-24 rotate-[7deg] lg:block',
    float: '8s',
    delay: '-4s',
  },
  {
    key: 'photo',
    Art: Photo,
    className: 'right-[11%] top-[12%] hidden h-24 w-24 rotate-[-7deg] lg:block',
    float: '10s',
    delay: '-1s',
  },
  {
    key: 'flow',
    Art: Flow,
    className: 'left-[9%] top-[46%] hidden h-28 w-28 rotate-[5deg] xl:block',
    float: '11s',
    delay: '-6s',
  },
  {
    key: 'cursor',
    Art: Cursor,
    className: 'right-[13%] top-[48%] hidden h-16 w-24 rotate-[-4deg] xl:block',
    float: '6s',
    delay: '-3s',
  },
];

const BoardArtifacts: React.FC = (): JSX.Element => {
  return (
    <div aria-hidden className='absolute inset-0'>
      {ARTIFACTS.map(({ key, Art, className, float, delay }) => (
        <div
          key={key}
          className={cn(
            'artifact-float absolute transition-transform duration-300 hover:scale-[1.08]',
            className
          )}
          style={
            {
              ['--float-duration' as string]: float,
              ['--float-delay' as string]: delay,
            } as React.CSSProperties
          }
        >
          <Art />
        </div>
      ))}
    </div>
  );
};
export default BoardArtifacts;
