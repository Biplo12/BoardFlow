import getStroke from 'perfect-freehand';
import React from 'react';

import { getSvgPathFromStroke } from '@/lib/utils';

import { PEN_NIB_SCALE } from '@/constant/canvas';

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  strokeWidth?: number;
  opacity?: number;
  onPointerDown?: (e: React.PointerEvent) => void;
}

const Path: React.FC<PathProps> = ({
  x,
  y,
  points,
  fill,
  strokeWidth = 4,
  opacity = 1,
  onPointerDown,
}): JSX.Element => {
  return (
    <path
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: strokeWidth * PEN_NIB_SCALE,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      fill={fill}
      opacity={opacity}
    />
  );
};
export default Path;
