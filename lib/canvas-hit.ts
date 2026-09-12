import { PEN_NIB_SCALE } from '@/constant/canvas';

import { Layer, LayerType, Point } from '@/types/TCanvasState';

const BASE_TOLERANCE = 8;

function distanceToSegment(point: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(point.x - a.x, point.y - a.y);
  }

  const t = Math.max(
    0,
    Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared)
  );

  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
}

function distanceToPolyline(point: Point, points: Point[], closed: boolean) {
  let shortest = Number.POSITIVE_INFINITY;
  const last = closed ? points.length : points.length - 1;

  for (let index = 0; index < last; index++) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    shortest = Math.min(shortest, distanceToSegment(point, a, b));
  }

  return shortest;
}

function isInsidePolygon(point: Point, polygon: Point[]) {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];

    if (
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside;
    }
  }

  return inside;
}

function corners(layer: Layer): Point[] {
  const { x, y, width, height } = layer;

  if (layer.type === LayerType.Diamond) {
    return [
      { x: x + width / 2, y },
      { x: x + width, y: y + height / 2 },
      { x: x + width / 2, y: y + height },
      { x, y: y + height / 2 },
    ];
  }

  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
}

function ellipseHit(layer: Layer, point: Point, reach: number, solid: boolean) {
  const rx = layer.width / 2;
  const ry = layer.height / 2;
  const dx = point.x - (layer.x + rx);
  const dy = point.y - (layer.y + ry);

  const outer =
    (dx / (rx + reach)) ** 2 + (dy / (ry + reach)) ** 2 <= 1;

  if (!outer) return false;
  if (solid) return true;

  const innerX = Math.max(rx - reach, 0.001);
  const innerY = Math.max(ry - reach, 0.001);

  return (dx / innerX) ** 2 + (dy / innerY) ** 2 >= 1;
}

/* The eraser and click targeting follow the shape, not its bounding box: an
   unfilled rectangle is only its outline, and a diagonal line is nowhere near
   the corners of the box that holds it. */
export function hitsLayer(
  layer: Layer,
  point: Point,
  tolerance: number = BASE_TOLERANCE
): boolean {
  const width = layer.strokeWidth ?? 2;
  const ink = layer.type === LayerType.Path ? width * PEN_NIB_SCALE : width;
  const reach = tolerance + ink / 2;

  if (
    point.x < layer.x - reach ||
    point.x > layer.x + layer.width + reach ||
    point.y < layer.y - reach ||
    point.y > layer.y + layer.height + reach
  ) {
    return false;
  }

  switch (layer.type) {
    case LayerType.Arrow:
    case LayerType.Line:
    case LayerType.Path: {
      if (layer.points.length < 2) return false;

      const points = layer.points.map(([px, py]) => ({
        x: layer.x + px,
        y: layer.y + py,
      }));

      return distanceToPolyline(point, points, false) <= reach;
    }

    case LayerType.Ellipse:
      return ellipseHit(layer, point, reach, layer.filled !== false);

    case LayerType.Rectangle:
    case LayerType.Diamond: {
      const polygon = corners(layer);

      if (layer.filled !== false) {
        return (
          isInsidePolygon(point, polygon) ||
          distanceToPolyline(point, polygon, true) <= reach
        );
      }

      return distanceToPolyline(point, polygon, true) <= reach;
    }

    default:
      return true;
  }
}

export const ERASER_RADIUS = 10;

/* An eraser stroke is a swept path, not a point: sampling it at the width of
   the nib means a fast flick cannot jump straight over a shape. */
export function hitsAlongSegment(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  from: Point,
  to: Point,
  tolerance: number = ERASER_RADIUS
): string[] {
  const span = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.min(
    128,
    Math.max(1, Math.ceil(span / Math.max(1, tolerance)))
  );

  const found = new Set<string>();

  for (let step = 0; step <= steps; step++) {
    const t = step / steps;
    const point = {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };

    for (const id of layerIds) {
      if (found.has(id)) continue;

      const layer = layers.get(id);

      if (layer && hitsLayer(layer, point, tolerance)) {
        found.add(id);
      }
    }
  }

  return [...found];
}

/* Topmost first: the last id in the paint order is the one on top. */
export function topmostHit(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  point: Point,
  tolerance?: number
): string | null {
  for (let index = layerIds.length - 1; index >= 0; index--) {
    const id = layerIds[index];
    const layer = layers.get(id);

    if (layer && hitsLayer(layer, point, tolerance)) {
      return id;
    }
  }

  return null;
}
