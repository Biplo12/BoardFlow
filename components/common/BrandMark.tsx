import React from 'react';

import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({ className }): JSX.Element => {
  return (
    <svg
      viewBox='0 0 32 32'
      fill='none'
      role='img'
      aria-label='BoardFlow'
      className={cn('h-8 w-8', className)}
    >
      <path
        d='M9.5 17.6 14.4 22.5 9.5 27.4 4.6 22.5Z'
        stroke='currentColor'
        strokeWidth='2.4'
        strokeLinejoin='round'
      />
      <path
        d='M12.9 19.1 17.5 14.5'
        stroke='currentColor'
        strokeWidth='2.4'
        strokeLinecap='butt'
      />
      <rect
        x='17.5'
        y='5'
        width='12.5'
        height='9.5'
        rx='2.5'
        fill='currentColor'
      />
    </svg>
  );
};
export default BrandMark;
