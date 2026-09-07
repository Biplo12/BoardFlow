import React from 'react';

import { cn } from '@/lib/utils';

const LINE = '#16283c';

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
        rx='7'
        transform='rotate(-6 13.5 14.5)'
        fill='var(--candy-pink, #ff3d7f)'
        stroke={LINE}
        strokeWidth='2'
      />
      {/* somebody on it, breaking the edge */}
      <path
        d='M14 10 14 25.1 18.2 21.3 20.7 29.3 24.9 27.6 22 20.1 28.7 19.2Z'
        fill='#fff'
        stroke={LINE}
        strokeWidth='2'
        strokeLinejoin='round'
      />
    </svg>
  );
};
export default BrandMark;
