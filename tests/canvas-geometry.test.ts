import { describe, expect, it } from 'vitest';

import {
  layerBoxFromDrag,
  segmentPoints,
  snapSegment,
  squarePoint,
} from '@/lib/canvas-geometry';
import {
  calculateFontSize,
  findIntersectingLayersWithRectangle,
  getContrastingTextColor,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
} from '@/lib/utils';

import { DEFAULT_SHAPE_SIZE, strokeDashArray } from '@/constant/canvas';

import { Camera, Layer, LayerType } from '@/types/TCanvasState';

const at = (clientX: number, clientY: number) =>
  ({ clientX, clientY }) as React.PointerEvent;

const box = (
  x: number,
  y: number,
  width: number,
  height: number
): Layer =>
  ({
    type: LayerType.Rectangle,
    x,
    y,
    width,
    height,
    fill: { r: 0, g: 0, b: 0 },
  }) as Layer;

describe('screen to world', () => {
  it('is the identity at the origin with no zoom', () => {
    const camera: Camera = { x: 0, y: 0, scale: 1 };
    expect(pointerEventToCanvasPoint(at(120, 80), camera)).toEqual({
      x: 120,
      y: 80,
    });
  });

  it('undoes the pan', () => {
    const camera: Camera = { x: -40, y: 25, scale: 1 };
    expect(pointerEventToCanvasPoint(at(100, 100), camera)).toEqual({
      x: 140,
      y: 75,
    });
  });

  it('undoes pan and zoom together', () => {
    const camera: Camera = { x: 200, y: 100, scale: 2 };
    expect(pointerEventToCanvasPoint(at(400, 300), camera)).toEqual({
      x: 100,
      y: 100,
    });
  });

  it('keeps the point under the cursor fixed when zooming about it', () => {
    const before: Camera = { x: 30, y: -10, scale: 1 };
    const screen = { x: 640, y: 360 };
    const world = pointerEventToCanvasPoint(at(screen.x, screen.y), before);

    const scale = 2.5;
    const after: Camera = {
      scale,
      x: screen.x - world.x * scale,
      y: screen.y - world.y * scale,
    };

    expect(pointerEventToCanvasPoint(at(screen.x, screen.y), after)).toEqual(
      world
    );
  });
});

describe('shape creation from a drag', () => {
  it('centres a default box on a plain click', () => {
    const { box: result, dragged } = layerBoxFromDrag({ x: 100, y: 100 });

    expect(dragged).toBe(false);
    expect(result).toEqual({
      x: 100 - DEFAULT_SHAPE_SIZE / 2,
      y: 100 - DEFAULT_SHAPE_SIZE / 2,
      width: DEFAULT_SHAPE_SIZE,
      height: DEFAULT_SHAPE_SIZE,
    });
  });

  it('treats a jittery click as a click, not a drag', () => {
    const { dragged } = layerBoxFromDrag({ x: 10, y: 10 }, { x: 12, y: 11 });
    expect(dragged).toBe(false);
  });

  it.each([
    ['down right', { x: 60, y: 80 }],
    ['down left', { x: -60, y: 80 }],
    ['up right', { x: 60, y: -80 }],
    ['up left', { x: -60, y: -80 }],
  ])('gives a positive box dragging %s', (_name, delta) => {
    const origin = { x: 200, y: 200 };
    const current = { x: origin.x + delta.x, y: origin.y + delta.y };
    const { box: result, dragged } = layerBoxFromDrag(origin, current);

    expect(dragged).toBe(true);
    expect(result.width).toBe(Math.abs(delta.x));
    expect(result.height).toBe(Math.abs(delta.y));
    expect(result.x).toBe(Math.min(origin.x, current.x));
    expect(result.y).toBe(Math.min(origin.y, current.y));
  });
});

describe('arrows and lines keep their direction', () => {
  it.each([
    ['down right', { x: 300, y: 400 }],
    ['down left', { x: 100, y: 400 }],
    ['up right', { x: 300, y: 100 }],
    ['up left', { x: 100, y: 100 }],
  ])('points from origin to cursor dragging %s', (_name, current) => {
    const origin = { x: 200, y: 250 };
    const { box: result } = layerBoxFromDrag(origin, current);
    const points = segmentPoints(origin, current, result);

    expect(points).toHaveLength(2);
    expect(result.x + points[0][0]).toBeCloseTo(origin.x);
    expect(result.y + points[0][1]).toBeCloseTo(origin.y);
    expect(result.x + points[1][0]).toBeCloseTo(current.x);
    expect(result.y + points[1][1]).toBeCloseTo(current.y);
  });

  it('separates the two diagonals that share a bounding box', () => {
    const a = segmentPoints(
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 0, width: 100, height: 100 }
    );
    const b = segmentPoints(
      { x: 100, y: 0 },
      { x: 0, y: 100 },
      { x: 0, y: 0, width: 100, height: 100 }
    );

    expect(a).not.toEqual(b);
  });
});

describe('marquee selection', () => {
  const layers = new Map<string, Layer>([
    ['a', box(0, 0, 50, 50)],
    ['b', box(200, 200, 50, 50)],
    ['c', box(25, 25, 50, 50)],
  ]);
  const ids = ['a', 'b', 'c'];

  it('catches what the rectangle covers', () => {
    const hit = findIntersectingLayersWithRectangle(
      ids,
      layers,
      { x: -10, y: -10 },
      { x: 90, y: 90 }
    );

    expect(hit.sort()).toEqual(['a', 'c']);
  });

  it('gives the same answer dragged in any direction', () => {
    const corners = [
      [
        { x: -10, y: -10 },
        { x: 90, y: 90 },
      ],
      [
        { x: 90, y: 90 },
        { x: -10, y: -10 },
      ],
      [
        { x: -10, y: 90 },
        { x: 90, y: -10 },
      ],
      [
        { x: 90, y: -10 },
        { x: -10, y: 90 },
      ],
    ] as const;

    const answers = corners.map(([a, b]) =>
      findIntersectingLayersWithRectangle(ids, layers, a, b).sort().join(',')
    );

    expect(new Set(answers).size).toBe(1);
  });

  it('does not catch a layer it merely passes near', () => {
    const hit = findIntersectingLayersWithRectangle(
      ids,
      layers,
      { x: 400, y: 400 },
      { x: 500, y: 500 }
    );

    expect(hit).toEqual([]);
  });
});

describe('freehand strokes', () => {
  it('wraps the points in a tight box and stores them relative to it', () => {
    const layer = penPointsToPathLayer(
      [
        [10, 20, 0.5],
        [40, 60, 0.5],
        [25, 15, 0.5],
      ],
      { r: 1, g: 2, b: 3 }
    );

    expect(layer.x).toBe(10);
    expect(layer.y).toBe(15);
    expect(layer.width).toBe(30);
    expect(layer.height).toBe(45);
    expect(layer.points[0][0]).toBe(0);
    expect(layer.points.every(([x, y]) => x >= 0 && y >= 0)).toBe(true);
  });

  it('refuses a stroke that is a single dot', () => {
    expect(() => penPointsToPathLayer([[1, 1, 0.5]], { r: 0, g: 0, b: 0 })).toThrow();
  });
});

describe('stroke styles', () => {
  it('has no dash pattern when solid', () => {
    expect(strokeDashArray('solid', 4)).toBeUndefined();
  });

  it('scales the pattern with the stroke width', () => {
    expect(strokeDashArray('dashed', 2)).not.toBe(strokeDashArray('dashed', 8));
  });

  it('draws dots as zero-length segments so round caps make circles', () => {
    expect(strokeDashArray('dotted', 4)).toBe('0 8');
  });
});

describe('text on shapes', () => {
  it('picks a readable ink for light and dark fills', () => {
    expect(getContrastingTextColor({ r: 255, g: 255, b: 255 })).toBe('#000');
    expect(getContrastingTextColor({ r: 10, g: 10, b: 10 })).toBe('#fff');
  });

  it('never returns a font size larger than the box', () => {
    expect(calculateFontSize(40, 20)).toBeLessThanOrEqual(20);
    expect(calculateFontSize(2000, 2000)).toBeLessThanOrEqual(96);
  });
});

describe('holding shift', () => {
  it('squares a shape off the longer side, in every direction', () => {
    const origin = { x: 100, y: 100 };

    expect(squarePoint(origin, { x: 200, y: 140 })).toEqual({ x: 200, y: 200 });
    expect(squarePoint(origin, { x: 140, y: 200 })).toEqual({ x: 200, y: 200 });
    expect(squarePoint(origin, { x: 0, y: 60 })).toEqual({ x: 0, y: 0 });
    expect(squarePoint(origin, { x: 60, y: 0 })).toEqual({ x: 0, y: 0 });
  });

  it('leaves a segment on the nearest fifteen degrees', () => {
    const origin = { x: 0, y: 0 };
    const snapped = snapSegment(origin, { x: 100, y: 8 });

    expect(snapped.y).toBeCloseTo(0);
    expect(Math.hypot(snapped.x, snapped.y)).toBeCloseTo(Math.hypot(100, 8));
  });

  it('keeps a perfect diagonal untouched', () => {
    const snapped = snapSegment({ x: 0, y: 0 }, { x: 50, y: 50 });

    expect(snapped.x).toBeCloseTo(50);
    expect(snapped.y).toBeCloseTo(50);
  });

  it('snaps to a multiple of the step, never in between', () => {
    for (let degrees = 0; degrees < 360; degrees += 7) {
      const radians = (degrees * Math.PI) / 180;
      const snapped = snapSegment(
        { x: 0, y: 0 },
        { x: Math.cos(radians) * 100, y: Math.sin(radians) * 100 }
      );
      const angle = (Math.atan2(snapped.y, snapped.x) * 180) / Math.PI;

      const off = Math.abs(angle % 15);

      expect(Math.min(off, 15 - off)).toBeLessThan(0.001);
    }
  });

  it('does nothing to a segment of no length', () => {
    expect(snapSegment({ x: 5, y: 5 }, { x: 5, y: 5 })).toEqual({ x: 5, y: 5 });
  });
});
