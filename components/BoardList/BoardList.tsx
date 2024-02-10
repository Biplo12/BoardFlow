'use client';

import { useQuery } from 'convex/react';
import React from 'react';

import BoardCard from '@/components/BoardList/Partials/BoardCard';
import BoardsLoading from '@/components/BoardList/Partials/BoardsLoading';
import NewBoardButton from '@/components/BoardList/Partials/NewBoardButton';
import EmptyBoards from '@/components/EmptyBoards';
import EmptyFavorites from '@/components/EmptyFavorites';
import EmptySearch from '@/components/EmptySearch';

import { api } from '@/convex/_generated/api';

interface BoardListProps {
  query: {
    search?: string;
    favorites?: string;
  };
  orgId: string;
}

const BoardList: React.FC<BoardListProps> = ({ orgId, query }): JSX.Element => {
  const boards = useQuery(api.boards.get, { orgId, ...query });

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
    <div className='flex h-full w-full flex-col gap-4 p-4'>
      <h2 className='text-2xl font-semibold'>
        {query.favorites ? 'Favorites Boards' : 'Team Boards'}
      </h2>
      <div className='grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        <NewBoardButton orgId={orgId} />
        {boards.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))}
      </div>
    </div>
  );
};
export default BoardList;
