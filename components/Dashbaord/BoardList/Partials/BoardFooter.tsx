import { useQuery } from 'convex/react';
import { Star } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useApiMutation } from '@/hooks/useApiMutation';

import { api } from '@/convex/_generated/api';
import Board from '@/constant/interfaces/Board';

interface BoardFooterProps {
  board: Board;
}

const BoardFooter: React.FC<BoardFooterProps> = ({ board }): JSX.Element => {
  const user = useQuery(api.users.viewer);
  const author = board.authorId === user?._id ? 'You' : board.authorName;

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
      <p className='text-muted-foreground truncate text-sm opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100'>
        {author}
      </p>
      <button
        className={cn(
          'text-muted-foreground hover:text-primary absolute top-3 right-3 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100',
          disabled && 'cursor-not-allowed opacity-75'
        )}
        onClick={handleToggleFavorite}
      >
        <Star
          className={cn('h-4 w-4', isFavorite && 'fill-primary text-primary')}
        />
      </button>
    </div>
  );
};
export default BoardFooter;
