import { Star } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import Board from '@/interfaces/Board';

interface BoardFooterProps {
  board: Board;
}

const BoardFooter: React.FC<BoardFooterProps> = ({ board }): JSX.Element => {
  const isFavorite = false;
  const disabled = true;
  return (
    <div className='relative bg-white p-3'>
      <p className='max-w-[calc(100%-20px)] truncate text-sm'>{board.title}</p>
      <p className='truncate text-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'>
        {board.authorName}
      </p>
      <button
        className={cn(
          'absolute right-3 top-3 text-muted-foreground opacity-0 transition hover:text-blue-950 group-hover:opacity-100',
          disabled && 'cursor-not-allowed opacity-75'
        )}
      >
        <Star
          className={cn('h-4 w-4', isFavorite && 'fill-blue-950 text-blue-950')}
        />
      </button>
    </div>
  );
};
export default BoardFooter;
