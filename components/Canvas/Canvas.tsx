'use client';

import React, { useCallback, useState } from 'react';

import { pointerEventToCanvasPoint } from '@/lib/utils';

import CanvasFloatingbar from '@/components/Canvas/CanvasInfo/CanvasFloatingbar';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasObjects from '@/components/Canvas/CanvasObjects';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar/CanvasToolbar';

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
} from '@/liveblocks.config';

import { Camera, CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }): JSX.Element => {
  const [canvasState, setCanvasState] = React.useState<TCanvasState>({
    CanvasMode: CanvasMode.None,
    layerType: undefined,
  });

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });

  const history = useHistory();
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);

      setMyPresence({ cursor: current });
    },
    []
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasFloatingbar boardId={boardId} />
      <CanvasParticipants />
      <CanvasToolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canRedo={canRedo}
        canUndo={canUndo}
      />
      <CanvasObjects onPointerMove={onPointerMove} onWheel={onWheel} />
    </main>
  );
};
export default Canvas;
