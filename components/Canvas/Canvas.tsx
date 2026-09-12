'use client';

import React, { useState } from 'react';

import useAlignLayers from '@/hooks/useAlignLayers';
import useCanvas from '@/hooks/useCanvas';
import useDeleteLayer from '@/hooks/useDeleteLayer';
import useDuplicateLayers from '@/hooks/useDuplicateLayers';
import useIsObjectSelected from '@/hooks/useIsObjectSelected';
import useLayerOrder from '@/hooks/useLayerOrder';

import CanvasHeader from '@/components/Canvas/CanvasInfo/CanvasHeader';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasObjects from '@/components/Canvas/CanvasObjects/CanvasObjects';
import CanvasStylePanel from '@/components/Canvas/CanvasStylePanel/CanvasStylePanel';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar/CanvasToolbar';
import CanvasZoom from '@/components/Canvas/CanvasZoom/CanvasZoom';
import CanvasDialogController from '@/components/Dialogs/CanvasDialogController';

import { useAppDispatch } from '@/store/store-hooks';

import { useSelf } from '@/liveblocks.config';
import { openDialog } from '@/state/dialogSlice';

import { CanvasMode, LayerType, TCanvasState } from '@/types/TCanvasState';

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

  const hasSelection = useSelf((me) => me.presence.selection.length > 0);
  const { sendToBack, sendBackward, bringForward, bringToFront } =
    useLayerOrder();
  const alignLayers = useAlignLayers();
  const { duplicateLayers } = useDuplicateLayers();
  const deleteLayers = useDeleteLayer();

  const dispatch = useAppDispatch();
  const isImageSelected = useIsObjectSelected(LayerType.Image);

  const openImageUrlDialog = () =>
    dispatch(openDialog({ currentDialog: 'SET_URL_DIALOG' }));

  const { camera } = canvasActions;
  const gridSize = 24 * camera.scale;

  const isDrawingTool =
    canvasState.mode === CanvasMode.Inserting ||
    canvasState.mode === CanvasMode.Pencil;

  return (
    <main
      className='relative h-full w-full'
      style={{
        backgroundColor: '#f7fafc',
        backgroundImage: `radial-gradient(rgba(0,18,52,0.13) ${1.4 * camera.scale}px, transparent ${1.4 * camera.scale}px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${camera.x}px ${camera.y}px`,
      }}
    >
      <CanvasHeader boardId={boardId} />
      <CanvasParticipants />
      <CanvasToolbar
        canvasActions={canvasActions}
        canvasState={canvasState}
        setCanvasState={canvasActions.setCanvasState}
      />
      <CanvasZoom canvasActions={canvasActions} />
      <CanvasStylePanel
        style={canvasActions.style}
        onChange={canvasActions.setStyle}
        visible={isDrawingTool || hasSelection}
        hasSelection={hasSelection}
        onSendToBack={sendToBack}
        onSendBackward={sendBackward}
        onBringForward={bringForward}
        onBringToFront={bringToFront}
        onAlign={alignLayers}
        onDuplicate={duplicateLayers}
        onDelete={deleteLayers}
        onSetImageUrl={isImageSelected ? openImageUrlDialog : undefined}
        onSlideStart={canvasActions.pauseHistory}
        onSlideEnd={canvasActions.resumeHistory}
      />
      <CanvasObjects canvasState={canvasState} canvasActions={canvasActions} />
      <CanvasDialogController />
    </main>
  );
};
export default Canvas;
