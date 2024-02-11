import getStroke from 'perfect-freehand';
import React from 'react';

import { getSvgPathFromStroke } from '@/lib/utils';

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
}

const Path: React.FC<PathProps> = ({
  x,
  y,
  points,
  fill,
  onPointerDown,
  stroke,
}): JSX.Element => {
  return (
    <path
      className='drop-shadow-md'
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
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
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
export default Path;
