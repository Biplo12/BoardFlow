'use client';

import React from 'react';

import CanvasFloatingBar from '@/components/Canvas/CanvasInfo/CanvasFloatingbar';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar/CanvasToolbar';

import { useCanRedo, useCanUndo, useHistory } from '@/liveblocks.config';

import { CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }): JSX.Element => {
  const [canvasState, setCanvasState] = React.useState<TCanvasState>({
    CanvasMode: CanvasMode.None,
  });

  const history = useHistory();
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasFloatingBar boardId={boardId} />
      <CanvasParticipants />
      <CanvasToolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canRedo={canRedo}
        canUndo={canUndo}
      />
    </main>
  );
};
export default Canvas;
