'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAppDispatch, useAppSelector } from '@/store/store-hooks';

import { api } from '@/convex/_generated/api';
import { closeDialog } from '@/state/dialogSlice';

const RenameDialog: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const dialogProps = useAppSelector((state) => state.dialog.dialogProps);

  const { id, title } = dialogProps as { id: string; title: string };

  const [boardTitle, setBoardTitle] = useState(title);

  const isOpen = useAppSelector((state) => state.dialog.isOpen);

  const { mutate, pending } = useApiMutation(api.board.rename);

  const handleClose = () => {
    dispatch(closeDialog());
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await mutate({ title: boardTitle, id });
      toast.success('Board renamed');
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to rename board');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>
        <DialogDescription>Enter a new title for this board</DialogDescription>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            disabled={pending}
            required
            maxLength={60}
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            placeholder='Board title'
          />
          <DialogFooter className='flex justify-end gap-2.5 sm:gap-2.5'>
            <DialogClose asChild>
              <button type='button' className='dialog-ghost'>
                Cancel
              </button>
            </DialogClose>
            <button disabled={pending} type='submit' className='dialog-primary'>
              {pending ? 'Saving…' : 'Save'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default RenameDialog;
