/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import useCanvas from '@/hooks/useCanvas';

import LayerPreview from '@/components/Canvas/CanvasObjects/LayerPreview';
import CursorsPresence from '@/components/Canvas/CursorsPresence/CursorsPresence';

import { TCanvasState } from '@/types/TCanvasState';

interface CanvasObjectsProps {
  setCanvasState: (newState: TCanvasState) => void;
  canvasState: TCanvasState;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  setCanvasState,
  canvasState,
}): JSX.Element => {
  const {
    onPointerMove,
    onWheel,
    onPointerLeave,
    onPointerUp,
    camera,
    layerIds,
  } = useCanvas({
    setCanvasState,
    canvasState,
  });

  return (
    <svg
      className='h-[100vh] w-[100vw]'
      onPointerMove={onPointerMove}
      onWheel={onWheel}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
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
            onLayerPointerDown={() => {}}
            selectionColor='#000'
          />
        ))}
        <CursorsPresence />
      </g>
    </svg>
  );
};

export default CanvasObjects;
