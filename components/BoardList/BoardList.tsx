import React from 'react';

import EmptyBoards from '@/components/EmptyBoards';
import EmptyFavorites from '@/components/EmptyFavorites';
import EmptySearch from '@/components/EmptySearch';

interface BoardListProps {
  query: {
    search?: string;
    favorites?: string;
  };
  orgId: string;
}

const BoardList: React.FC<BoardListProps> = ({ orgId, query }): JSX.Element => {
  const data = [];

  if (query.search && !data?.length) {
    return <EmptySearch />;
  }

  if (query.favorites && !data?.length) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return <EmptyBoards />;
  }

  return <div>BoardList</div>;
};
export default BoardList;
