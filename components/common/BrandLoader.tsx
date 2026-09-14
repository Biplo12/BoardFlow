'use client';

import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

interface BrandLoaderProps {
  label?: string;
  fixed?: boolean;
  className?: string;
}

const BrandLoader: React.FC<BrandLoaderProps> = ({
  label = 'Loading',
  fixed,
  className,
}): JSX.Element | null => {
  const body = (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        fixed && 'fixed inset-0 z-[9999]',
        className
      )}
      style={{ backgroundColor: '#f2fafe' }}
    >
      <div
        className='flex items-center gap-4 rounded-[20px] border-2 bg-white px-7 py-5'
        style={{
          borderColor: 'var(--candy-ink)',
          boxShadow: '0 4px 0 0 rgba(0,18,52,0.16)',
        }}
      >
        <span className='loader-ring' aria-hidden />
        <span
          className='text-[15px] font-bold'
          style={{ color: 'var(--candy-ink)' }}
        >
          {label}
        </span>
      </div>
    </div>
  );

  /* The overlay is only ever raised from a click handler, so it never has to
     survive hydration and can be portalled straight away. */
  if (!fixed) return body;
  if (typeof document === 'undefined') return null;

  return createPortal(body, document.body);
};
export default BrandLoader;
