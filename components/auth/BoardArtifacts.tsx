import React from 'react';

import { cn } from '@/lib/utils';

/* One rule for every artifact: a chunky dark outline around a flat fill,
   the same treatment the cursor already had. */
const LINE = 'rgba(0,18,52,0.32)';
const STROKE = 3.5;

const Checklist = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect
      x='2'
      y='2'
      width='88'
      height='88'
      rx='14'
      fill='var(--candy-butter)'
      stroke={LINE}
      strokeWidth={STROKE}
    />
    <g stroke={LINE} strokeWidth={STROKE} strokeLinecap='round' fill='#fff'>
      <rect x='14' y='19' width='15' height='15' rx='4' />
      <rect x='14' y='42' width='15' height='15' rx='4' />
      <rect x='14' y='65' width='15' height='15' rx='4' />
    </g>
    <path
      d='M17.5 27l4 4 7-8'
      fill='none'
      stroke={LINE}
      strokeWidth={STROKE}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <g stroke={LINE} strokeWidth={STROKE} strokeLinecap='round'>
      <path d='M38 27h38M38 50h30M38 73h35' />
    </g>
  </svg>
);

const Doodle = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect
      x='2'
      y='2'
      width='88'
      height='88'
      rx='14'
      fill='var(--candy-pink)'
      stroke={LINE}
      strokeWidth={STROKE}
    />
    <path
      d='M46 17l8 19.5 20.5 1.5-15.5 13.5 4.8 20.5L46 61.5 28.2 72l4.8-20.5L17.5 38 38 36.5Z'
      fill='#fff'
      stroke={LINE}
      strokeWidth={STROKE}
      strokeLinejoin='round'
    />
  </svg>
);

const Chart = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect
      x='2'
      y='2'
      width='88'
      height='88'
      rx='14'
      fill='var(--candy-lime)'
      stroke={LINE}
      strokeWidth={STROKE}
    />
    <g fill='#fff' stroke={LINE} strokeWidth={STROKE} strokeLinejoin='round'>
      <rect x='17' y='50' width='14' height='24' rx='4' />
      <rect x='39' y='36' width='14' height='38' rx='4' />
      <rect x='61' y='24' width='14' height='50' rx='4' />
    </g>
  </svg>
);

const Photo = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect
      x='2'
      y='2'
      width='88'
      height='88'
      rx='14'
      fill='var(--candy-violet)'
      stroke={LINE}
      strokeWidth={STROKE}
    />
    <circle
      cx='31'
      cy='30'
      r='9'
      fill='#fff'
      stroke={LINE}
      strokeWidth={STROKE}
    />
    <path
      d='M12 74 35 47l14 14 11-11 20 24Z'
      fill='#fff'
      stroke={LINE}
      strokeWidth={STROKE}
      strokeLinejoin='round'
    />
  </svg>
);

const Flow = () => (
  <svg viewBox='0 0 92 92' className='h-full w-full'>
    <rect
      x='2'
      y='2'
      width='88'
      height='88'
      rx='14'
      fill='#fff'
      stroke={LINE}
      strokeWidth={STROKE}
    />
    <g stroke={LINE} strokeWidth={STROKE} strokeLinejoin='round'>
      <rect
        x='13'
        y='14'
        width='30'
        height='18'
        rx='6'
        fill='var(--candy-lime)'
      />
      <rect
        x='49'
        y='38'
        width='30'
        height='18'
        rx='6'
        fill='var(--candy-butter)'
      />
      <rect
        x='13'
        y='62'
        width='30'
        height='18'
        rx='6'
        fill='var(--candy-pink)'
      />
    </g>
    <g stroke={LINE} strokeWidth={STROKE} fill='none' strokeLinecap='round'>
      <path d='M43 23h15a6 6 0 0 1 6 6v5' />
      <path d='M49 47H34a6 6 0 0 0-6 6v5' />
    </g>
  </svg>
);

const Cursor = () => (
  <svg viewBox='0 0 92 62' className='h-full w-full'>
    <path
      d='M6 4 6 40 16 31 22 50 32 46 25 28 41 26Z'
      fill='#fff'
      stroke={LINE}
      strokeWidth={STROKE}
      strokeLinejoin='round'
    />
    <rect
      x='34'
      y='30'
      width='54'
      height='26'
      rx='13'
      fill='var(--candy-pink)'
      stroke={LINE}
      strokeWidth={STROKE}
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
