import React from 'react';

import { arrowHead } from '@/lib/canvas-geometry';
import { shapeStyle } from '@/lib/canvas-style';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { ArrowLayer } from '@/types/TCanvasState';

interface ArrowProps {
  id: string;
  layer: ArrowLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Arrow: React.FC<ArrowProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element | null => {
  const { x, y, points } = layer;

  if (points.length < 2) return null;

  const style = shapeStyle(layer);

  const start = { x: x + points[0][0], y: y + points[0][1] };
  const end = { x: x + points[1][0], y: y + points[1][1] };
  const [left, right] = arrowHead(start, end, style.strokeWidth);

  const stroke = {
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeLinecap: 'round' as const,
  };

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)} opacity={style.opacity}>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        strokeDasharray={style.strokeDasharray}
        {...stroke}
      />
      <line x1={end.x} y1={end.y} x2={left.x} y2={left.y} {...stroke} />
      <line x1={end.x} y1={end.y} x2={right.x} y2={right.y} {...stroke} />
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke='transparent'
        strokeWidth={style.strokeWidth + HIT_STROKE_PADDING}
        strokeLinecap='round'
      />
    </g>
  );
};
export default Arrow;
