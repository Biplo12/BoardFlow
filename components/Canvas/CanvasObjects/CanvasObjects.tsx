/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import useCanvas from '@/hooks/useCanvas';

import LayerPreview from '@/components/Canvas/CanvasObjects/LayerPreview';
import SelectionBox from '@/components/Canvas/CanvasObjects/SelectionBox';
import CursorsPresence from '@/components/Canvas/CursorsPresence/CursorsPresence';

import { CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasObjectsProps {
  canvasState: TCanvasState;
  canvasActions: ReturnType<typeof useCanvas>;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  canvasState,
  canvasActions,
}): JSX.Element => {
  const {
    camera,
    layerIds,
    layerIdsToColorSelection,
    onPointerMove,
    onWheel,
    onPointerLeave,
    onPointerUp,
    onPointerDown,
    onLayerPointerDown,
    onResizeHandlePointerDown,
  } = canvasActions;
  return (
    <svg
      className='h-[100vh] w-[100vw]'
      onPointerMove={onPointerMove}
      onWheel={onWheel}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
    >
      <g
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px)`,
        }}
      >
        {layerIds.map((layerId, index) => (
          <LayerPreview
            key={index}
            layerId={layerId}
            onLayerPointerDown={onLayerPointerDown}
            selectionColor={layerIdsToColorSelection[layerId]}
          />
        ))}
        <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
        {canvasState.mode === CanvasMode.SelectingNet &&
          canvasState.current != null && (
            <rect
              className='fill-blue-500/5 stroke-blue-500 stroke-1'
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
        <CursorsPresence />
      </g>
    </svg>
  );
};

export default CanvasObjects;
