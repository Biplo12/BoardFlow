import { useAuth } from '@clerk/nextjs';
import { Star } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useApiMutation } from '@/hooks/useApiMutation';

import { api } from '@/convex/_generated/api';
import Board from '@/interfaces/Board';

interface BoardFooterProps {
  board: Board;
}

const BoardFooter: React.FC<BoardFooterProps> = ({ board }): JSX.Element => {
  const { userId } = useAuth();
  const author = board.authorName === userId ? 'You' : board.authorName;

  const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
    api.board.favorite
  );

  const { mutate: onUnfavorite, pending: pendingUnfavorite } = useApiMutation(
    api.board.unfavorite
  );

  const isFavorite = board.isFavorite;

  const disabled = pendingFavorite || pendingUnfavorite;

  const handleToggleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFavorite) {
      try {
        await onUnfavorite({ id: board._id });
        toast.success('Board removed from favorites');
      } catch (error) {
        toast.error('Failed to unfavorite board');
        console.log(error);
      }
    } else {
      try {
        await onFavorite({ id: board._id, orgId: board.orgId });
        toast.success('Board added to favorites');
      } catch (error) {
        toast.error('Failed to favorite board');
        console.log(error);
      }
    }
  };

  return (
    <div className='relative bg-white p-3'>
      <p className='max-w-[calc(100%-20px)] truncate text-sm'>{board.title}</p>
      <p className='truncate text-sm text-muted-foreground opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100'>
        {author}
      </p>
      <button
        className={cn(
          'absolute right-3 top-3 text-muted-foreground opacity-100 transition hover:text-blue-950 lg:opacity-0 lg:group-hover:opacity-100',
          disabled && 'cursor-not-allowed opacity-75'
        )}
        onClick={handleToggleFavorite}
      >
        <Star
          className={cn('h-4 w-4', isFavorite && 'fill-blue-950 text-blue-950')}
        />
      </button>
    </div>
  );
};
export default BoardFooter;
