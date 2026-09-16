import React from 'react';

import NewBoardButton from '@/components/Dashbaord/BoardList/Partials/NewBoardButton';

import { Id } from '@/convex/_generated/dataModel';

const PLACEHOLDER_COUNT = 7;

interface BoardsLoadingProps {
  query: {
    search?: string;
    favorites?: string;
  };
  orgId: Id<'organizations'>;
}

/* The query usually resolves in a blink, so the whole section just greys out
   rather than flashing a shimmering skeleton. */
const BoardsLoading: React.FC<BoardsLoadingProps> = ({
  query,
  orgId,
}): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col gap-6 p-4 opacity-45'>
      <h2
        className='candy-display text-[32px] sm:text-[40px]'
        style={{ color: 'var(--candy-ink)' }}
      >
        {query.favorites ? 'Favorite boards' : 'Team boards'}
      </h2>
      <div className='grid grid-cols-1 gap-5 pb-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        <NewBoardButton orgId={orgId} disabled />
        {[...Array(PLACEHOLDER_COUNT)].map((_, index) => (
          <div
            key={index}
            className='aspect-[100/127] rounded-[18px]'
            style={{ backgroundColor: 'rgba(0,18,52,0.08)' }}
          />
        ))}
      </div>
    </div>
  );
};
export default BoardsLoading;
