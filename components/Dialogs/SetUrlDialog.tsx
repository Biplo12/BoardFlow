'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import useSelectedLayerInfo from '@/hooks/useSelectedLayerInfo';
import useUpdateValue from '@/hooks/useUpdateValue';

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

import { closeDialog } from '@/state/dialogSlice';

const SetUrlDialog: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const [imageURL, setImageURL] = useState('');

  const isOpen = useAppSelector((state) => state.dialog.isOpen);

  const { updateValue } = useUpdateValue();
  const { selection } = useSelectedLayerInfo();

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      updateValue(imageURL, selection?.[0]);
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Failed to update image URL');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Image URL</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Set the URL for selected Image object.
        </DialogDescription>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            required
            maxLength={200}
            name='url'
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
          <DialogFooter className='flex justify-end gap-2.5 sm:gap-2.5'>
            <DialogClose asChild>
              <button type='button' className='dialog-ghost'>
                Cancel
              </button>
            </DialogClose>
            <button type='submit' className='dialog-primary'>
              Save
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default SetUrlDialog;
