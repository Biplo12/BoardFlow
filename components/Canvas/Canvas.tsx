'use client';

import React from 'react';

import useCanvas from '@/hooks/useCanvas';

import CanvasFloatingbar from '@/components/Canvas/CanvasInfo/CanvasFloatingbar';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasObjects from '@/components/Canvas/CanvasObjects/CanvasObjects';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar/CanvasToolbar';
import SelectionTools from '@/components/Canvas/SelectionTools/SelectionTools';

import { useHistory } from '@/liveblocks.config';

import { CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }): JSX.Element => {
  const [canvasState, setCanvasState] = React.useState<TCanvasState>({
    mode: CanvasMode.None,
    layerType: undefined,
  });

  const history = useHistory();

  const canvasActions = useCanvas({
    setCanvasState,
    canvasState,
  });

  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasFloatingbar boardId={boardId} />
      <CanvasParticipants />
      <CanvasToolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools canvasActions={canvasActions} />
      <CanvasObjects canvasState={canvasState} canvasActions={canvasActions} />
    </main>
  );
};
export default Canvas;
