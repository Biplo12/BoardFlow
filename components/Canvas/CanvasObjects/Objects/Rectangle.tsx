/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { colorToCss } from '@/lib/utils';

import { RectangleLayer } from '@/types/TCanvasState';

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const Rectangle: React.FC<RectangleProps> = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}): JSX.Element => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className='drop-shadow-md'
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={fill ? colorToCss(fill) : '#000'}
      stroke={selectionColor || 'transparent'}
    />
  );
};
export default Rectangle;
