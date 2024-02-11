/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { colorToCss } from '@/lib/utils';
import useCanvas from '@/hooks/useCanvas';

import LayerPreview from '@/components/Canvas/CanvasObjects/LayerPreview';
import Path from '@/components/Canvas/CanvasObjects/Objects/Path';
import SelectionBox from '@/components/Canvas/CanvasObjects/SelectionBox';
import CursorsPresence from '@/components/Canvas/CursorsPresence/CursorsPresence';

import { useSelf } from '@/liveblocks.config';

import { CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasObjectsProps {
  canvasState: TCanvasState;
  canvasActions: ReturnType<typeof useCanvas>;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  canvasState,
  canvasActions,
}): JSX.Element => {
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const {
    camera,
    layerIds,
    layerIdsToColorSelection,
    lastUsedColor,
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
              x={Math.min(canvasState.origin?.x, canvasState.current.x)}
              y={Math.min(canvasState.origin?.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin?.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin?.y - canvasState.current.y)}
            />
          )}
        <CursorsPresence />
        {pencilDraft != null && pencilDraft.length > 0 && (
          <Path
            points={pencilDraft}
            fill={colorToCss(lastUsedColor)}
            x={0}
            y={0}
          />
        )}
      </g>
    </svg>
  );
};

export default CanvasObjects;
