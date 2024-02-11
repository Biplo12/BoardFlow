import React from 'react';

import CursorsPresence from '@/components/Canvas/CursorsPresence/CursorsPresence';

interface CanvasObjectsProps {
  onPointerMove: (e: React.PointerEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  onPointerMove,
  onWheel,
}): JSX.Element => {
  return (
    <svg
      className='h-[100vh] w-[100vw]'
      onPointerMove={onPointerMove}
      onWheel={onWheel}
    >
      <g>
        <CursorsPresence />
      </g>
    </svg>
  );
};

export default CanvasObjects;
