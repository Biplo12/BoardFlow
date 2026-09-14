import { MIN_LAYER_SIZE } from '@/lib/canvas-geometry';

import { Point, Side, XYWH } from '@/types/TCanvasState';

export type ResizeResult = {
  box: XYWH;
  flipX: boolean;
  flipY: boolean;
};

/* Dragging a handle past the opposite edge turns the box inside out. The box
   itself is normalised, and the flip is reported so the contents can be
   mirrored with it instead of sliding out of their own frame. */
export function resizeBox(
  bounds: XYWH,
  corner: Side,
  point: Point
): ResizeResult {
  const box = { ...bounds };
  let flipX = false;
  let flipY = false;

  if ((corner & Side.Left) === Side.Left) {
    const anchor = bounds.x + bounds.width;
    box.x = Math.min(point.x, anchor);
    box.width = Math.max(MIN_LAYER_SIZE, Math.abs(anchor - point.x));
    flipX = point.x > anchor;
  }

  if ((corner & Side.Right) === Side.Right) {
    box.x = Math.min(point.x, bounds.x);
    box.width = Math.max(MIN_LAYER_SIZE, Math.abs(point.x - bounds.x));
    flipX = point.x < bounds.x;
  }

  if ((corner & Side.Top) === Side.Top) {
    const anchor = bounds.y + bounds.height;
    box.y = Math.min(point.y, anchor);
    box.height = Math.max(MIN_LAYER_SIZE, Math.abs(anchor - point.y));
    flipY = point.y > anchor;
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    box.y = Math.min(point.y, bounds.y);
    box.height = Math.max(MIN_LAYER_SIZE, Math.abs(point.y - bounds.y));
    flipY = point.y < bounds.y;
  }

  return { box, flipX, flipY };
}

export type ScalableLayer = XYWH & { points?: number[][] };

export type ScaledLayer = XYWH & { points?: number[][] };

/* Every layer in the selection moves and scales with the box, so resizing two
   shapes together keeps their relative placement. */
export function scaleLayer(
  layer: ScalableLayer,
  initial: XYWH,
  next: XYWH,
  flip: { flipX: boolean; flipY: boolean } = { flipX: false, flipY: false }
): ScaledLayer {
  const sx = initial.width === 0 ? 1 : next.width / initial.width;
  const sy = initial.height === 0 ? 1 : next.height / initial.height;

  const offsetX = layer.x - initial.x;
  const offsetY = layer.y - initial.y;

  const width = layer.width * sx;
  const height = layer.height * sy;

  const x = flip.flipX
    ? next.x + next.width - (offsetX + layer.width) * sx
    : next.x + offsetX * sx;
  const y = flip.flipY
    ? next.y + next.height - (offsetY + layer.height) * sy
    : next.y + offsetY * sy;

  const scaled: ScaledLayer = { x, y, width, height };

  if (layer.points) {
    scaled.points = layer.points.map(([px, py, ...rest]) => [
      flip.flipX ? width - px * sx : px * sx,
      flip.flipY ? height - py * sy : py * sy,
      ...rest,
    ]);
  }

  return scaled;
}
