import React from 'react';

import { cn } from '@/lib/utils';

/* The board's own vocabulary, drawn small and in a deeper tone of the
   ground. Solid strokes, never translucent - a see-through line over a
   tinted page reads as a washed-out edge. Each motif is placed off the
   grid and at its own angle so the tile scatters instead of lining up. */
const LINE = '#a6d6ee';
const STROKE = 2.5;

const MOTIFS = [
  { d: 'M0 0h13l7 7v19H0Z M13 0v7h7', at: 'translate(14 18) rotate(-7)' },
  { d: 'M0 4c5-9 10 7 15-2s9 6 13-1', at: 'translate(78 14) rotate(5)' },
  {
    d: 'M6 0h24a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H15l-8 6v-6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6Z',
    at: 'translate(126 30) rotate(7)',
  },
  {
    d: 'M0 0 0 21 6 15 10.5 25 15 23 10.5 13.5 18 12.5Z',
    at: 'translate(28 72) rotate(-12)',
  },
  {
    d: 'M13 19c-9-6-13-10-13-15A6.5 6.5 0 0 1 13 4 6.5 6.5 0 0 1 26 4c0 5-4 9-13 15Z',
    at: 'translate(74 88) rotate(9)',
  },
  {
    d: 'M10 0c1.5 6 3.5 8 9.5 9.5-6 1.5-8 3.5-9.5 9.5-1.5-6-3.5-8-9.5-9.5C6.5 8 8.5 6 10 0Z',
    at: 'translate(140 78) rotate(0)',
  },
  {
    d: 'M0 12c9-12 23-12 31 1l-8-2 3 8',
    at: 'translate(14 128) rotate(-4)',
  },
  {
    d: 'M2 20 14 8l6 6L8 26 0 28Z M11 11l6 6',
    at: 'translate(84 132) rotate(6)',
  },
  {
    d: 'M12 0a12 12 0 1 1 0 24 12 12 0 0 1 0-24Z M6 12.5 10.5 17l8-9',
    at: 'translate(132 130) rotate(-3)',
  },
];

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
          id='boardflow-tile'
          width='180'
          height='180'
          patternUnits='userSpaceOnUse'
        >
          <g
            fill='none'
            stroke={LINE}
            strokeWidth={STROKE}
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            {MOTIFS.map((motif) => (
              <path key={motif.at} d={motif.d} transform={motif.at} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill='url(#boardflow-tile)' />
    </svg>
  );
};
export default BrandPattern;
