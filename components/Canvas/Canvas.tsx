'use client';

import React, { useState } from 'react';

import useCanvas from '@/hooks/useCanvas';

import CanvasHeader from '@/components/Canvas/CanvasInfo/CanvasHeader';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasObjects from '@/components/Canvas/CanvasObjects/CanvasObjects';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar/CanvasToolbar';
import SelectionTools from '@/components/Canvas/SelectionTools/SelectionTools';
import CanvasDialogController from '@/components/Dialogs/CanvasDialogController';

import { CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }): JSX.Element => {
  const [canvasState, setCanvasState] = useState<TCanvasState>({
    mode: CanvasMode.None,
    layerType: undefined,
  });

  const canvasActions = useCanvas({
    setCanvasState,
    canvasState,
  });

  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasHeader boardId={boardId} />
      <CanvasParticipants />
      <CanvasToolbar
        canvasActions={canvasActions}
        canvasState={canvasState}
        setCanvasState={setCanvasState}
      />
      <SelectionTools canvasActions={canvasActions} />
      <CanvasObjects canvasState={canvasState} canvasActions={canvasActions} />
      <CanvasDialogController />
    </main>
  );
};
export default Canvas;
