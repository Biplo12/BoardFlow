import { DEFAULT_SHAPE_SIZE, MIN_DRAG_TO_SIZE } from '@/constant/canvas';

import { Point, XYWH } from '@/types/TCanvasState';

/* A click and a drag both have to produce a sane box, and a drag in any of the
   four directions has to come out with positive width and height. */
export function layerBoxFromDrag(
  origin: Point,
  current?: Point,
  size: number = DEFAULT_SHAPE_SIZE
): { box: XYWH; dragged: boolean } {
  const dragged =
    current != null &&
    Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
      MIN_DRAG_TO_SIZE;

  if (!dragged || current == null) {
    return {
      dragged: false,
      box: {
        x: origin.x - size / 2,
        y: origin.y - size / 2,
        width: size,
        height: size,
      },
    };
  }

  return {
    dragged: true,
    box: {
      x: Math.min(origin.x, current.x),
      y: Math.min(origin.y, current.y),
      width: Math.abs(current.x - origin.x),
      height: Math.abs(current.y - origin.y),
    },
  };
}

/* Arrows and lines cannot be rebuilt from a bounding box, because both
   diagonals of a box give the same box. The two ends are kept explicitly,
   relative to the box origin. */
export function segmentPoints(
  origin: Point,
  current: Point | undefined,
  box: XYWH
): number[][] {
  const end = current ?? { x: origin.x + box.width, y: origin.y };

  return [
    [origin.x - box.x, origin.y - box.y],
    [end.x - box.x, end.y - box.y],
  ];
}

/* Holding shift makes a shape square and a segment snap to a fixed set of
   angles, the way every drawing tool behaves. */
export function squarePoint(origin: Point, current: Point): Point {
  const dx = current.x - origin.x;
  const dy = current.y - origin.y;
  const size = Math.max(Math.abs(dx), Math.abs(dy));

  return {
    x: origin.x + Math.sign(dx || 1) * size,
    y: origin.y + Math.sign(dy || 1) * size,
  };
}

export const SNAP_DEGREES = 15;

export function snapSegment(
  origin: Point,
  current: Point,
  degrees: number = SNAP_DEGREES
): Point {
  const dx = current.x - origin.x;
  const dy = current.y - origin.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) return current;

  const step = (degrees * Math.PI) / 180;
  const angle = Math.round(Math.atan2(dy, dx) / step) * step;

  return {
    x: origin.x + Math.cos(angle) * length,
    y: origin.y + Math.sin(angle) * length,
  };
}
