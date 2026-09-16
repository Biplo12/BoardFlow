import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useApiMutation } from '@/hooks/useApiMutation';

import { useAppDispatch, useAppSelector } from '@/store/store-hooks';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  selectIsOpeningBoard,
  startOpeningBoard,
  stopOpeningBoard,
} from '@/state/boardOpeningSlice';

interface NewBoardButtonProps {
  orgId: Id<'organizations'>;
  disabled?: boolean;
}

const NewBoardButton: React.FC<NewBoardButtonProps> = ({
  orgId,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isOpening = useAppSelector(selectIsOpeningBoard);
  const { mutate, pending } = useApiMutation(api.board.create);

  const handleCreateBoard = async () => {
    dispatch(startOpeningBoard());
    /* Let the overlay paint before the request goes out, so the grid is
       already hidden while the board is being created. */
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    try {
      const boardId = await mutate({ orgId, title: 'New Board' });
      router.push(`/board/${boardId}`);
    } catch (error) {
      toast.error('Could not create the board. Try again.');
      console.error(error);
      dispatch(stopOpeningBoard());
    }
  };

  const busy = pending || isOpening || disabled;

  return (
    <button
      disabled={busy}
      onClick={handleCreateBoard}
      className={cn(
        'board-tile col-span-1 flex aspect-[100/127] flex-col items-center justify-center gap-2 py-6',
        busy && 'cursor-not-allowed opacity-75'
      )}
      style={{ backgroundColor: 'var(--candy-pink)' }}
    >
      <Plus className='h-11 w-11 stroke-[2.5] text-white' />
      <p className='text-[15px] font-bold text-white'>New board</p>
    </button>
  );
};
export default NewBoardButton;
