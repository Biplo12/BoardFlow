import React from 'react';

import { shapeStyle } from '@/lib/canvas-style';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { ArrowLayer } from '@/types/TCanvasState';

const HEAD_SPREAD = Math.PI / 7;

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

  const startX = x + points[0][0];
  const startY = y + points[0][1];
  const endX = x + points[1][0];
  const endY = y + points[1][1];

  const angle = Math.atan2(endY - startY, endX - startX);
  const headLength = Math.max(12, style.strokeWidth * 4);

  /* The shaft stops short of the tip so a thick head does not swallow it. */
  const shaftX = endX - Math.cos(angle) * headLength * 0.6;
  const shaftY = endY - Math.sin(angle) * headLength * 0.6;

  const head = [
    `${endX},${endY}`,
    `${endX - headLength * Math.cos(angle - HEAD_SPREAD)},${endY - headLength * Math.sin(angle - HEAD_SPREAD)}`,
    `${endX - headLength * Math.cos(angle + HEAD_SPREAD)},${endY - headLength * Math.sin(angle + HEAD_SPREAD)}`,
  ].join(' ');

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)} opacity={style.opacity}>
      <line
        x1={startX}
        y1={startY}
        x2={shaftX}
        y2={shaftY}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.strokeDasharray}
        strokeLinecap='round'
      />
      <polygon points={head} fill={style.stroke} stroke='none' />
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke='transparent'
        strokeWidth={style.strokeWidth + HIT_STROKE_PADDING}
        strokeLinecap='round'
      />
    </g>
  );
};
export default Arrow;
