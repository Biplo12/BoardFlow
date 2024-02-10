'use client';

import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { Link2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAppDispatch } from '@/store/store-hooks';

import { api } from '@/convex/_generated/api';
import { openDialog } from '@/state/dialogSlice';

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps['side'];
  sideOffset?: DropdownMenuContentProps['sideOffset'];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const dispatch = useAppDispatch();
  const { mutate, pending } = useApiMutation(api.board.remove);

  const onCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/board/${id}`);
    toast.success('Link copied to clipboard');
  };

  const handleOpenRenameDialog = () => {
    dispatch(
      openDialog({
        currentDialog: 'RENAME_BOARD_TITLE_DIALOG',
        dialogProps: { id, title },
      })
    );
  };

  const handleDeleteBoard = async () => {
    try {
      await mutate({ id });
      if (window.location.pathname.includes(id)) {
        window.location.href = '/';
      }
      toast.success('Board deleted successfully');
    } catch (error) {
      toast.error('Failed to delete board');
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className='w-60'
      >
        <DropdownMenuItem onClick={onCopyLink} className='cursor-pointer p-3'>
          <Link2 className='mr-2 h-4 w-4' />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer p-3'
          onClick={handleOpenRenameDialog}
        >
          <Pencil className='mr-2 h-4 w-4' />
          Rename
        </DropdownMenuItem>
        <ConfirmDialog
          header='Delete board?'
          description='This will delete the board and all of its contents.'
          disabled={pending}
          onConfirm={handleDeleteBoard}
        >
          <Button
            variant='ghost'
            className='w-full cursor-pointer justify-start p-3 text-sm font-normal'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
