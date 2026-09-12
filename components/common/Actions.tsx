'use client';

import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { Link2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import ConfirmDialog from '@/components/Dialogs/ConfirmDialog';
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
  canManage?: boolean;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
  canManage = false,
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
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete board'
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset ?? 8}
        className='w-56 rounded-[18px] border-2 p-2'
        style={{
          borderColor: 'var(--candy-ink)',
          boxShadow: '0 4px 0 0 rgba(0,18,52,0.18)',
        }}
      >
        <DropdownMenuItem
          onClick={onCopyLink}
          className='cursor-pointer gap-2.5 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold'
          style={{ color: 'var(--candy-ink)' }}
        >
          <Link2 className='h-[18px] w-[18px]' />
          Copy board link
        </DropdownMenuItem>
        {/* Renaming and deleting belong to whoever made the board. Everyone
            else used to be offered both and got a raw server error. */}
        {canManage && (
          <DropdownMenuItem
            className='cursor-pointer gap-2.5 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold'
            style={{ color: 'var(--candy-ink)' }}
            onClick={handleOpenRenameDialog}
          >
            <Pencil className='h-[18px] w-[18px]' />
            Rename
          </DropdownMenuItem>
        )}
        {canManage && (
        <ConfirmDialog
          header='Delete board?'
          description='This will delete the board and all of its contents.'
          disabled={pending}
          onConfirm={handleDeleteBoard}
        >
          <button
            className='flex w-full cursor-pointer items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[15px] font-semibold transition-colors hover:bg-[rgba(255,61,127,0.1)]'
            style={{ color: 'var(--candy-pink)' }}
          >
            <Trash2 className='h-[18px] w-[18px]' />
            Delete
          </button>
        </ConfirmDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
