/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import useCanvas from '@/hooks/useCanvas';

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
  const { onPointerMove, onWheel, onPointerLeave, onPointerUp, camera } =
    useCanvas({
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
        <CursorsPresence />
      </g>
    </svg>
  );
};

export default CanvasObjects;
