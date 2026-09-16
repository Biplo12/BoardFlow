import React from 'react';

import { shapeStyle } from '@/lib/canvas-style';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { RectangleLayer } from '@/types/TCanvasState';

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Rectangle: React.FC<RectangleProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element => {
  const { x, y, width, height } = layer;
  const style = shapeStyle(layer);

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)} opacity={style.opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={style.radius}
        ry={style.radius}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.strokeDasharray}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={style.radius}
        ry={style.radius}
        fill='none'
        stroke='transparent'
        strokeWidth={style.strokeWidth + HIT_STROKE_PADDING}
        pointerEvents='stroke'
      />
    </g>
  );
};
export default Rectangle;
