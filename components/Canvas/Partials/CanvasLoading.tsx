import React from 'react';

import BrandMark from '@/components/common/BrandMark';

const CanvasLoading: React.FC = (): JSX.Element => {
  return (
    <main className='bg-background relative flex h-full w-full flex-col items-center justify-center gap-3'>
      <BrandMark className='text-foreground h-14 w-14 animate-pulse duration-1000 ease-in-out' />
      <span
        className='text-muted-foreground font-display text-[11px] font-semibold uppercase'
        style={{ letterSpacing: '0.1em' }}
      >
        Joining the board
      </span>
    </main>
  );
};
export default CanvasLoading;
