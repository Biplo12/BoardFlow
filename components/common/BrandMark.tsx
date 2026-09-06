import React from 'react';

import { cn } from '@/lib/utils';

const LINE = 'rgba(0,18,52,0.32)';

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
      {/* the board */}
      <rect
        x='3'
        y='4'
        width='21'
        height='21'
        rx='6'
        transform='rotate(-6 13.5 14.5)'
        fill='var(--candy-pink, #ff3d7f)'
        stroke={LINE}
        strokeWidth='1.8'
      />
      {/* somebody on it, breaking the edge */}
      <path
        d='M15 12 15 25 18.6 21.7 20.8 28.6 24.4 27.1 21.8 20.6 27.6 19.9Z'
        fill='#fff'
        stroke={LINE}
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
    </svg>
  );
};
export default BrandMark;
