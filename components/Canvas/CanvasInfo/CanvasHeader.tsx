'use client';

import { useQuery } from 'convex/react';
import { Menu } from 'lucide-react';
import React from 'react';

import CanvasHeaderLoading from '@/components/Canvas/CanvasInfo/Loading/CanvasHeaderLoading';
import { Actions } from '@/components/common/Actions';
import Hint from '@/components/common/Hint';
import Logo from '@/components/common/Logo';
import TabSeparator from '@/components/common/TabSeparator';
import { Button } from '@/components/ui/button';

import { useAppDispatch } from '@/store/store-hooks';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { openDialog } from '@/state/dialogSlice';

interface CanvasHeaderProps {
  boardId: string;
}

const CanvasHeader: React.FC<CanvasHeaderProps> = ({
  boardId,
}): JSX.Element => {
  const dispatch = useAppDispatch();
  const board = useQuery(api.board.get, { id: boardId as Id<'boards'> });

  if (!board) {
    return <CanvasHeaderLoading />;
  }

  const handleOpenRenameDialog = (id: string, title: string) => {
    dispatch(
      openDialog({
        currentDialog: 'RENAME_BOARD_TITLE_DIALOG',
        dialogProps: { id, title },
      })
    );
  };

  return (
    <div className='canvas-panel absolute top-2 left-2 flex h-[52px] items-center px-2'>
      <Hint label='Go to boards' side='bottom' sideOffset={10}>
        <Logo href='/dashboard' className='px-2' />
      </Hint>
      <TabSeparator />
      <Hint label='Edit title' side='bottom' sideOffset={10}>
        <Button
          className='px-2 text-base font-normal'
          size='sm'
          variant='ghost'
          onClick={() => handleOpenRenameDialog(board._id, board.title)}
        >
          {board.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions id={board._id} title={board.title} side='bottom' sideOffset={10}>
        <div>
          <Hint label='Main menu' side='bottom' sideOffset={10}>
            <Button size='sm' variant='ghost'>
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};
export default CanvasHeader;
