import React from 'react';

import { cn } from '@/lib/utils';

import LeaderTag from '@/components/common/LeaderTag';

const TARGETS = [
  {
    label: 'You',
    route: 'var(--route-magenta)',
    position: 'top-[54%] left-[12%] md:top-[16%] md:left-[30%]',
    legX: '34px',
    legY: '-22px',
    duration: '13s',
  },
  {
    label: 'Tom',
    route: 'var(--route-cyan)',
    position: 'top-[58%] left-[56%] md:top-[46%] md:left-[58%]',
    legX: '-26px',
    legY: '26px',
    duration: '11s',
  },
  {
    label: 'Priya',
    route: 'var(--route-green)',
    position: 'hidden md:block md:bottom-[22%] md:left-[22%]',
    legX: '28px',
    legY: '18px',
    duration: '15s',
  },
  {
    label: 'Sam',
    route: 'var(--route-violet)',
    position: 'hidden md:block md:top-[70%] md:left-[70%]',
    legX: '-22px',
    legY: '-28px',
    duration: '9s',
    flip: true,
  },
];

interface SectorViewProps {
  className?: string;
}

const SectorView: React.FC<SectorViewProps> = ({ className }): JSX.Element => {
  return (
    <div aria-hidden className={cn('pointer-events-none relative', className)}>
      <svg
        viewBox='0 0 420 460'
        className='absolute inset-0 h-full w-full'
        preserveAspectRatio='xMidYMid slice'
      >
        <g className='hidden md:block'>
          <g stroke='hsl(var(--route-cyan) / 0.08)' fill='none' strokeWidth='1'>
            <circle cx='232' cy='196' r='72' />
            <circle cx='232' cy='196' r='136' />
            <circle cx='232' cy='196' r='200' />
          </g>

          <circle
            className='range-ping'
            cx='140'
            cy='84'
            r='64'
            fill='none'
            stroke='hsl(var(--route-magenta))'
            strokeWidth='1.5'
          />
        </g>

        <g
          stroke='hsl(var(--foreground) / 0.14)'
          fill='none'
          strokeWidth='2.5'
          strokeLinejoin='miter'
        >
          <path d='M60 250 H136 V318 H60 Z' />
          <circle cx='320' cy='300' r='34' />
          <path d='M246 372 H322 V420 H246 Z' />
        </g>

        <g
          className='hidden md:block'
          stroke='hsl(var(--foreground) / 0.22)'
          strokeWidth='1'
          strokeDasharray='4 5'
          fill='none'
        >
          <path d='M92 128 L128 92 L156 92' />
          <path d='M300 232 L266 266 L232 266' />
          <path d='M76 372 L112 340 L140 340' />
        </g>
      </svg>

      {TARGETS.map((target) => (
        <div
          key={target.label}
          className={cn('sector-target absolute', target.position)}
          style={
            {
              ['--leg-x' as string]: target.legX,
              ['--leg-y' as string]: target.legY,
              ['--leg-duration' as string]: target.duration,
            } as React.CSSProperties
          }
        >
          <LeaderTag
            label={target.label}
            route={target.route}
            flip={target.flip}
          />
        </div>
      ))}
    </div>
  );
};
export default SectorView;
