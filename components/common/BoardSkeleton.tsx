'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

const PANEL = 'absolute rounded-[20px] border-2 bg-white/85';

interface BoardSkeletonProps {
  fixed?: boolean;
  className?: string;
}

/* The board arriving, rather than a spinner on an empty page: the same
   chrome in the same places, so nothing jumps when the real one mounts. */
const BoardSkeleton: React.FC<BoardSkeletonProps> = ({
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
        style={{ borderColor: 'rgba(0,18,52,0.16)' }}
      />
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
        className={cn(PANEL, 'top-1/2 left-3 h-[420px] w-[56px] -translate-y-1/2')}
        style={{ borderColor: 'rgba(0,18,52,0.16)' }}
      />
      <span
        className='absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-bold tracking-[0.14em] uppercase'
        style={{ color: 'var(--candy-muted)' }}
      >
        Opening your board
      </span>
    </div>
  );

  if (!fixed) return body;
  if (typeof document === 'undefined') return null;

  return createPortal(body, document.body);
};
export default BoardSkeleton;
