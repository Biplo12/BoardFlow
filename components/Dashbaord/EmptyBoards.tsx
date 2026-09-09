'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';
import { useOrganization } from '@/hooks/useOrganization';

import Peep from '@/components/common/Peep';

import { useAppDispatch, useAppSelector } from '@/store/store-hooks';

import { api } from '@/convex/_generated/api';
import {
  selectIsOpeningBoard,
  startOpeningBoard,
  stopOpeningBoard,
} from '@/state/boardOpeningSlice';

const EmptyBoards: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const dispatch = useAppDispatch();
  const isOpening = useAppSelector(selectIsOpeningBoard);

  const handleCreateBoard = async () => {
    if (!organization) return;
    dispatch(startOpeningBoard());
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    try {
      const boardId = await mutate({
        orgId: organization._id,
        title: 'New Board',
      });
      router.push(`/board/${boardId}`);
    } catch (error) {
      toast.error('Could not create the board. Try again.');
      console.error(error);
      dispatch(stopOpeningBoard());
    }
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 text-center'>
      <Peep figure='pointing' className='h-[230px]' />
      <h1
        className='candy-display text-[32px]'
        style={{ color: 'var(--candy-ink)' }}
      >
        Make your first board
      </h1>
      <p
        className='max-w-[340px] text-[16px] font-medium'
        style={{ color: 'var(--candy-muted)' }}
      >
        Name it and it opens. Everything else happens on the canvas.
      </p>
      <button
        onClick={handleCreateBoard}
        disabled={pending || isOpening}
        className='candy-button mt-2 flex h-14 items-center rounded-[22px] px-8 text-[17px] font-semibold text-white disabled:opacity-60'
        style={{ backgroundColor: 'var(--candy-pink)' }}
      >
        {pending || isOpening ? 'Creating…' : 'Create a board'}
      </button>
    </div>
  );
};
export default EmptyBoards;
