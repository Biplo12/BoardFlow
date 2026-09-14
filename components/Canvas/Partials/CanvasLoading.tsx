import React from 'react';

import BoardSkeleton from '@/components/common/BoardSkeleton';

const CanvasLoading: React.FC = (): JSX.Element => {
  return (
    <main className='relative h-full w-full'>
      <BoardSkeleton />
    </main>
  );
};
export default CanvasLoading;
