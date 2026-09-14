import { useQuery } from 'convex/react';
import { Star } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useApiMutation } from '@/hooks/useApiMutation';

import Board from '@/constant/interfaces/Board';
import { api } from '@/convex/_generated/api';

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
    <div
      className='relative border-t-2 bg-white p-3.5'
      style={{ borderColor: 'var(--candy-ink)' }}
    >
      <p
        className='max-w-[calc(100%-24px)] truncate text-[15px] font-bold'
        style={{ color: 'var(--candy-ink)' }}
      >
        {board.title}
      </p>
      <p
        className='truncate text-[13px] font-medium opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100'
        style={{ color: 'var(--candy-muted)' }}
      >
        {author}
      </p>
      <button
        className={cn(
          'absolute top-3.5 right-3.5 transition-transform hover:scale-115 lg:opacity-0 lg:group-hover:opacity-100',
          isFavorite && 'lg:opacity-100',
          disabled && 'cursor-not-allowed opacity-75'
        )}
        onClick={handleToggleFavorite}
      >
        <Star
          className='h-[18px] w-[18px]'
          style={{
            color: isFavorite ? 'var(--candy-pink)' : 'var(--candy-muted)',
            fill: isFavorite ? 'var(--candy-pink)' : 'transparent',
          }}
        />
      </button>
    </div>
  );
};
export default BoardFooter;
