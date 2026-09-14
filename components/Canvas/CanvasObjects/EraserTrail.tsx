import getStroke from 'perfect-freehand';
import React from 'react';

import { ERASER_RADIUS } from '@/lib/canvas-hit';
import { getSvgPathFromStroke } from '@/lib/utils';

interface EraserTrailProps {
  points: number[][];
  scale: number;
}

/* The nib is a fixed size on screen, so its world size shrinks as the board is
   zoomed in. The stroke tapers towards the tail, which is what makes it read
   as a smudge that is being wiped away rather than a drawn line. */
const EraserTrail: React.FC<EraserTrailProps> = ({
  points,
  scale,
}): JSX.Element | null => {
  if (points.length < 2) {
    return null;
  }

  const size = (ERASER_RADIUS * 2) / scale;

  const outline = getStroke(points, {
    size,
    thinning: 0.4,
    smoothing: 0.6,
    streamline: 0.5,
    simulatePressure: false,
    last: false,
    start: { taper: size * 6, cap: false },
    end: { taper: 0, cap: true },
  });

  return (
    <path
      className='pointer-events-none'
      d={getSvgPathFromStroke(outline)}
      fill='rgba(17, 17, 17, 0.28)'
    />
  );
};
export default EraserTrail;
