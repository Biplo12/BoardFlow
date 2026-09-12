'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

const PANEL = 'absolute rounded-[20px] border-2 bg-white/85';
const PANEL_BORDER = 'rgba(0,18,52,0.16)';
const SLOT = 'h-10 w-10 rounded-[12px]';
const SLOT_FILL = 'rgba(0,18,52,0.07)';

/* The board arriving, rather than a spinner on an empty page: the same chrome
   in the same places, at the same sizes, so nothing jumps when the real one
   mounts. The toolbar is the top-centre strip and the zoom control sits
   bottom-right, which is where they actually are. */
const BoardSkeleton: React.FC<{ fixed?: boolean; className?: string }> = ({
  fixed,
  className,
}): JSX.Element | null => {
  const body = (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden',
        fixed && 'fixed inset-0 z-[9999]',
        className
      )}
      style={{
        backgroundColor: '#f7fafc',
        backgroundImage:
          'radial-gradient(rgba(0,18,52,0.13) 1.4px, transparent 1.4px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div
        className={cn(PANEL, 'top-2 left-2 h-[52px] w-[300px]')}
        style={{ borderColor: PANEL_BORDER }}
      />

      <div
        className={cn(
          PANEL,
          'top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 p-1.5'
        )}
        style={{ borderColor: PANEL_BORDER }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className={SLOT}
            style={{ backgroundColor: SLOT_FILL }}
          />
        ))}
      </div>

      <div className='absolute top-3 right-3 flex -space-x-4'>
        {[0, 1].map((index) => (
          <span
            key={index}
            className='h-12 w-12 rounded-[32%] border-[3px] bg-white/85'
            style={{ borderColor: 'rgba(0,18,52,0.18)' }}
          />
        ))}
      </div>

      <div
        className={cn(PANEL, 'right-3 bottom-3 flex items-center gap-1 p-1.5')}
        style={{ borderColor: PANEL_BORDER }}
      >
        <span className={SLOT} style={{ backgroundColor: SLOT_FILL }} />
        <span
          className='h-10 w-[62px] rounded-[12px]'
          style={{ backgroundColor: SLOT_FILL }}
        />
        <span className={SLOT} style={{ backgroundColor: SLOT_FILL }} />
      </div>

      <span
        className='absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-bold tracking-[0.14em] uppercase'
        style={{ color: 'var(--candy-muted)' }}
      >
        Opening your board
      </span>
    </div>
  );

  /* The overlay is only ever raised from a click handler, so it never has to
     survive hydration and can be portalled straight away. */
  if (!fixed) return body;
  if (typeof document === 'undefined') return null;

  return createPortal(body, document.body);
};
export default BoardSkeleton;
