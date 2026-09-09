'use client';

import { useQuery } from 'convex/react';
import React from 'react';

import BoardCard from '@/components/Dashbaord/BoardList/Partials/BoardCard';
import BoardsLoading from '@/components/Dashbaord/BoardList/Partials/BoardsLoading';
import NewBoardButton from '@/components/Dashbaord/BoardList/Partials/NewBoardButton';
import EmptyBoards from '@/components/Dashbaord/EmptyBoards';
import EmptyFavorites from '@/components/Dashbaord/EmptyFavorites';
import EmptySearch from '@/components/Dashbaord/EmptySearch';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface BoardListProps {
  query: {
    search?: string;
    favorites?: string;
  };
  orgId: Id<'organizations'>;
}

const BoardList: React.FC<BoardListProps> = ({ orgId, query }): JSX.Element => {
  const boards = useQuery(api.boards.get, {
    orgId,
    search: query?.search,
    favorites: query?.favorites,
  });

  if (boards === undefined) {
    return <BoardsLoading query={query} orgId={orgId} />;
  }

  if (query.search && !boards?.length) {
    return <EmptySearch />;
  }

  if (query.favorites && !boards?.length) {
    return <EmptyFavorites />;
  }

  if (!boards?.length) {
    return <EmptyBoards />;
  }

  return (
    <div className='flex h-full w-full flex-col gap-6 p-4'>
      <h2
        className='candy-display text-[32px] sm:text-[40px]'
        style={{ color: 'var(--candy-ink)' }}
      >
        {query.favorites ? 'Favorite boards' : 'Team boards'}
      </h2>
      <div className='grid grid-cols-1 gap-5 pb-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        <NewBoardButton orgId={orgId} />
        {boards.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))}
      </div>
    </div>
  );
};
export default BoardList;
