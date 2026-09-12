import React from 'react';

import { shapeStyle } from '@/lib/canvas-style';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { DiamondLayer } from '@/types/TCanvasState';

interface DiamondProps {
  id: string;
  layer: DiamondLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Diamond: React.FC<DiamondProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element => {
  const { x, y, width, height } = layer;
  const style = shapeStyle(layer);

  const points = [
    `${x + width / 2},${y}`,
    `${x + width},${y + height / 2}`,
    `${x + width / 2},${y + height}`,
    `${x},${y + height / 2}`,
  ].join(' ');

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)} opacity={style.opacity}>
      <polygon
        points={points}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.strokeDasharray}
        strokeLinecap='round'
        strokeLinejoin={layer.edges === 'round' ? 'round' : 'miter'}
      />
      <polygon
        points={points}
        fill='none'
        stroke='transparent'
        strokeWidth={style.strokeWidth + HIT_STROKE_PADDING}
        pointerEvents='stroke'
      />
    </g>
  );
};
export default Diamond;
