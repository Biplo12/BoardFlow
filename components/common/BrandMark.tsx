import React from 'react';

import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({ className }): JSX.Element => {
  return (
    <svg
      viewBox='0 0 32 32'
      role='img'
      aria-label='BoardFlow'
      className={cn('h-8 w-8', className)}
    >
      <defs>
        <clipPath id='brandmark-first'>
          <rect
            x='2'
            y='7'
            width='19'
            height='19'
            rx='6'
            transform='rotate(-9 11.5 16.5)'
          />
        </clipPath>
      </defs>

      <rect
        x='2'
        y='7'
        width='19'
        height='19'
        rx='6'
        transform='rotate(-9 11.5 16.5)'
        fill='var(--candy-pink, #ff3d7f)'
      />
      <rect
        x='11'
        y='6'
        width='19'
        height='19'
        rx='6'
        transform='rotate(9 20.5 15.5)'
        fill='var(--candy-violet, #9466e8)'
      />
      <g clipPath='url(#brandmark-first)'>
        <rect
          x='11'
          y='6'
          width='19'
          height='19'
          rx='6'
          transform='rotate(9 20.5 15.5)'
          fill='#5a2ea6'
        />
      </g>
    </svg>
  );
};
export default BrandMark;
