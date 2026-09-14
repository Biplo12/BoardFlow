import React from 'react';

import { shapeStyle } from '@/lib/canvas-style';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { LineLayer } from '@/types/TCanvasState';

interface LineProps {
  id: string;
  layer: LineLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Line: React.FC<LineProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element | null => {
  const { x, y, points } = layer;

  if (points.length < 2) return null;

  const style = shapeStyle(layer);
  const ends = {
    x1: x + points[0][0],
    y1: y + points[0][1],
    x2: x + points[1][0],
    y2: y + points[1][1],
  };

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)} opacity={style.opacity}>
      <line
        {...ends}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.strokeDasharray}
        strokeLinecap='round'
      />
      <line
        {...ends}
        stroke='transparent'
        strokeWidth={style.strokeWidth + HIT_STROKE_PADDING}
        strokeLinecap='round'
      />
    </g>
  );
};
export default Line;
