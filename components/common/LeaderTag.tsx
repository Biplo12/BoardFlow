import React from 'react';

import { cn } from '@/lib/utils';

interface LeaderTagProps {
  label: string;
  route: string;
  flip?: boolean;
  className?: string;
}

const LeaderTag: React.FC<LeaderTagProps> = ({
  label,
  route,
  flip = false,
  className,
}): JSX.Element => {
  return (
    <div
      className={cn('relative h-[26px] w-[26px]', className)}
      style={{ ['--route' as string]: route }}
    >
      <svg viewBox='0 0 26 26' className='absolute inset-0 h-[26px] w-[26px]'>
        <path
          d={
            flip
              ? 'M20.5 1 25 5.5 20.5 10 16 5.5Z'
              : 'M5.5 16 10 20.5 5.5 25 1 20.5Z'
          }
          fill='hsl(var(--route))'
        />
        <path
          d={flip ? 'M17.5 8.5 7.5 18.5' : 'M8.5 17.5 18.5 7.5'}
          stroke='hsl(var(--route))'
          strokeWidth='1.5'
          strokeLinecap='butt'
        />
      </svg>
      <span
        className={cn(
          'font-display absolute block max-w-[14ch] truncate rounded-[3px] px-[7px] py-[3px] text-[11px] font-semibold uppercase',
          flip
            ? 'top-[16px] right-[18px]'
            : 'right-auto bottom-[16px] left-[18px]'
        )}
        style={{
          backgroundColor: 'hsl(var(--route))',
          color: 'hsl(var(--card))',
          fontStretch: '118%',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
    </div>
  );
};
export default LeaderTag;
