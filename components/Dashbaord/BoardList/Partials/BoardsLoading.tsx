import React from 'react';

import NewBoardButton from '@/components/Dashbaord/BoardList/Partials/NewBoardButton';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_COUNT = 5;

interface BoardsLoadingProps {
  query: {
    search?: string;
    favorites?: string;
  };
  orgId: string;
}

const BoardsLoading: React.FC<BoardsLoadingProps> = ({
  query,
  orgId,
}): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col gap-4 p-4'>
      <h2 className='text-3xl'>
        {query.favorites ? 'Favorite boards' : 'Team boards'}
      </h2>
      <div className='mt-8 grid grid-cols-1 gap-5 pb-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        <NewBoardButton orgId={orgId} disabled />
        {[...Array(SKELETON_COUNT)].map((_, index) => (
          <div
            className='aspect-[100/127] overflow-hidden rounded-lg'
            key={index}
          >
            <Skeleton className='h-full w-full' />
          </div>
        ))}
      </div>
    </div>
  );
};
export default BoardsLoading;
