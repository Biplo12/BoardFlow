import React from 'react';

import { cn } from '@/lib/utils';

interface BrandPatternProps {
  className?: string;
}

const BrandPattern: React.FC<BrandPatternProps> = ({
  className,
}): JSX.Element => {
  return (
    <svg aria-hidden className={cn('pointer-events-none', className)}>
      <defs>
        <pattern
          id='boardflow-pattern'
          width='180'
          height='180'
          patternUnits='userSpaceOnUse'
        >
          {/* sticky note */}
          <g transform='translate(14 18) rotate(-8)'>
            <rect width='30' height='30' rx='6' fill='rgba(255,255,255,0.55)' />
            <path
              d='M7 11h16M7 17h16M7 23h9'
              stroke='rgba(0,18,52,0.16)'
              strokeWidth='2.5'
              strokeLinecap='round'
            />
          </g>

          {/* pencil squiggle */}
          <path
            d='M74 34c8-12 16 10 24-2s14 6 20-2'
            fill='none'
            stroke='rgba(0,18,52,0.16)'
            strokeWidth='3'
            strokeLinecap='round'
          />

          {/* cursor */}
          <g transform='translate(146 16)'>
            <path
              d='M0 0 0 19 5 14.5 8.5 22 12 20.2 8.6 13 15 12Z'
              fill='rgba(255,255,255,0.75)'
              stroke='rgba(0,18,52,0.18)'
              strokeWidth='1.5'
              strokeLinejoin='round'
            />
          </g>

          {/* ring */}
          <circle
            cx='30'
            cy='96'
            r='13'
            fill='none'
            stroke='rgba(0,18,52,0.16)'
            strokeWidth='3'
          />

          {/* connector with a node at each end */}
          <g stroke='rgba(0,18,52,0.16)' strokeWidth='3' strokeLinecap='round'>
            <path d='M74 104h18a8 8 0 0 1 8 8v10' fill='none' />
            <circle cx='70' cy='104' r='4' fill='rgba(255,255,255,0.7)' />
            <circle cx='100' cy='126' r='4' fill='rgba(255,255,255,0.7)' />
          </g>

          {/* tilted card */}
          <g transform='translate(136 92) rotate(9)'>
            <rect width='28' height='22' rx='5' fill='rgba(255,255,255,0.55)' />
            <path
              d='M0 16 8 9l6 5 5-4 9 6v1a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5Z'
              fill='rgba(0,18,52,0.14)'
            />
            <circle cx='8' cy='6' r='3' fill='rgba(0,18,52,0.14)' />
          </g>

          {/* spark */}
          <path
            d='M42 148v14M35 155h14'
            stroke='rgba(0,18,52,0.16)'
            strokeWidth='3'
            strokeLinecap='round'
          />

          {/* dashed path */}
          <path
            d='M84 158h44'
            stroke='rgba(0,18,52,0.16)'
            strokeWidth='3'
            strokeLinecap='round'
            strokeDasharray='2 9'
          />

          {/* triangle */}
          <path
            d='M156 148l11 18h-22Z'
            fill='none'
            stroke='rgba(0,18,52,0.16)'
            strokeWidth='3'
            strokeLinejoin='round'
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#boardflow-pattern)' />
    </svg>
  );
};
export default BrandPattern;
