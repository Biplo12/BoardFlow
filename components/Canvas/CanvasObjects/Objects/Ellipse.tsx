import React from 'react';

import { shapeStyle } from '@/lib/canvas-style';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { EllipseLayer } from '@/types/TCanvasState';

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Ellipse: React.FC<EllipseProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element => {
  const { x, y, width, height } = layer;
  const style = shapeStyle(layer);

  const geometry = {
    cx: x + width / 2,
    cy: y + height / 2,
    rx: width / 2,
    ry: height / 2,
  };

  return (
    <g onPointerDown={(e) => onPointerDown(e, id)} opacity={style.opacity}>
      <ellipse
        {...geometry}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeDasharray={style.strokeDasharray}
      />
      <ellipse
        {...geometry}
        fill='none'
        stroke='transparent'
        strokeWidth={style.strokeWidth + HIT_STROKE_PADDING}
        pointerEvents='stroke'
      />
    </g>
  );
};
export default Ellipse;
