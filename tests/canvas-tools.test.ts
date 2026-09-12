import { describe, expect, it } from 'vitest';

import { layerBoxFromDrag, MIN_LAYER_SIZE } from '@/lib/canvas-geometry';
import { hitsAlongSegment, hitsLayer, topmostHit } from '@/lib/canvas-hit';
import { OrderMove, orderMoves } from '@/lib/canvas-order';
import { resizeBox, scaleLayer } from '@/lib/canvas-resize';
import { shapeStyle } from '@/lib/canvas-style';
import { penPointsToPathLayer } from '@/lib/utils';

import { Layer, LayerType, Side } from '@/types/TCanvasState';

const INK = { r: 0, g: 0, b: 0 };

const shape = (type: LayerType, extra: Partial<Layer> = {}): Layer =>
  ({
    type,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: INK,
    strokeWidth: 2,
    ...extra,
  }) as Layer;

describe('hit testing follows the shape', () => {
  it('catches a click inside a filled rectangle', () => {
    expect(hitsLayer(shape(LayerType.Rectangle), { x: 50, y: 50 })).toBe(true);
  });

  it('ignores a click well outside any shape', () => {
    expect(hitsLayer(shape(LayerType.Rectangle), { x: 400, y: 400 })).toBe(
      false
    );
  });

  it('leaves the middle of a transparent rectangle alone', () => {
    const outline = shape(LayerType.Rectangle, { filled: false });

    expect(hitsLayer(outline, { x: 50, y: 50 })).toBe(false);
    expect(hitsLayer(outline, { x: 0, y: 50 })).toBe(true);
  });

  it('treats a layer drawn before the style panel as filled', () => {
    const legacy = shape(LayerType.Rectangle, { filled: undefined });
    expect(hitsLayer(legacy, { x: 50, y: 50 })).toBe(true);
  });

  it('does not catch the corners of the box around a diamond', () => {
    const diamond = shape(LayerType.Diamond);

    expect(hitsLayer(diamond, { x: 50, y: 50 })).toBe(true);
    expect(hitsLayer(diamond, { x: 3, y: 3 })).toBe(false);
  });

  it('does not catch the corners of the box around an ellipse', () => {
    const ellipse = shape(LayerType.Ellipse);

    expect(hitsLayer(ellipse, { x: 50, y: 50 })).toBe(true);
    expect(hitsLayer(ellipse, { x: 2, y: 2 })).toBe(false);
    expect(hitsLayer(ellipse, { x: 99, y: 50 })).toBe(true);
  });

  it('leaves the middle of a transparent ellipse alone', () => {
    const ring = shape(LayerType.Ellipse, { filled: false });

    expect(hitsLayer(ring, { x: 50, y: 50 })).toBe(false);
    expect(hitsLayer(ring, { x: 100, y: 50 })).toBe(true);
  });

  it.each([LayerType.Arrow, LayerType.Line])(
    'follows the stroke of a diagonal, not its box (%i)',
    (type) => {
      const segment = shape(type, {
        points: [
          [0, 0],
          [100, 100],
        ],
      });

      expect(hitsLayer(segment, { x: 50, y: 52 })).toBe(true);
      expect(hitsLayer(segment, { x: 95, y: 5 })).toBe(false);
    }
  );

  it('follows every leg of a freehand stroke', () => {
    const path = shape(LayerType.Path, {
      width: 50,
      height: 50,
      points: [
        [0, 0],
        [50, 0],
        [50, 50],
      ],
    });

    expect(hitsLayer(path, { x: 25, y: 3 })).toBe(true);
    expect(hitsLayer(path, { x: 5, y: 45 })).toBe(false);
  });

  it('gives a thicker stroke a wider grab area', () => {
    const point = { x: 50, y: 66 };
    const thin = shape(LayerType.Line, {
      strokeWidth: 2,
      points: [
        [0, 50],
        [100, 50],
      ],
    });
    const thick = shape(LayerType.Line, {
      strokeWidth: 20,
      points: [
        [0, 50],
        [100, 50],
      ],
    });

    expect(hitsLayer(thin, point)).toBe(false);
    expect(hitsLayer(thick, point)).toBe(true);
  });

  it('treats notes and text as solid boxes', () => {
    expect(hitsLayer(shape(LayerType.Note), { x: 50, y: 50 })).toBe(true);
    expect(hitsLayer(shape(LayerType.Text), { x: 50, y: 50 })).toBe(true);
  });

  it('refuses a segment that never got a second point', () => {
    const stub = shape(LayerType.Line, { points: [[0, 0]] });
    expect(hitsLayer(stub, { x: 0, y: 0 })).toBe(false);
  });
});

describe('picking the layer on top', () => {
  const layers = new Map<string, Layer>([
    ['under', shape(LayerType.Rectangle)],
    ['over', shape(LayerType.Rectangle, { x: 40, y: 40 })],
  ]);

  it('takes the last one painted', () => {
    expect(topmostHit(['under', 'over'], layers, { x: 50, y: 50 })).toBe(
      'over'
    );
  });

  it('falls through to the one below when the top is missed', () => {
    expect(topmostHit(['under', 'over'], layers, { x: 10, y: 10 })).toBe(
      'under'
    );
  });

  it('returns nothing on empty canvas', () => {
    expect(topmostHit(['under', 'over'], layers, { x: 900, y: 900 })).toBe(
      null
    );
  });
});

describe('resizing a box', () => {
  const bounds = { x: 100, y: 100, width: 200, height: 100 };

  it('moves the dragged edge and pins the opposite one', () => {
    const { box } = resizeBox(bounds, Side.Left, { x: 50, y: 0 });

    expect(box).toEqual({ x: 50, y: 100, width: 250, height: 100 });
  });

  it('drags a corner on both axes at once', () => {
    const { box } = resizeBox(bounds, Side.Bottom + Side.Right, {
      x: 400,
      y: 300,
    });

    expect(box).toEqual({ x: 100, y: 100, width: 300, height: 200 });
  });

  it.each([
    ['left', Side.Left, { x: 400, y: 0 }, true, false],
    ['right', Side.Right, { x: 20, y: 0 }, true, false],
    ['top', Side.Top, { x: 0, y: 400 }, false, true],
    ['bottom', Side.Bottom, { x: 0, y: 20 }, false, true],
  ])(
    'reports the flip when %s is dragged past the far edge',
    (_name, corner, point, flipX, flipY) => {
      const result = resizeBox(bounds, corner as Side, point);

      expect(result.box.width).toBeGreaterThanOrEqual(0);
      expect(result.box.height).toBeGreaterThanOrEqual(0);
      expect(result.flipX).toBe(flipX);
      expect(result.flipY).toBe(flipY);
    }
  );

  it('never reports a negative size', () => {
    const { box } = resizeBox(bounds, Side.Top + Side.Left, {
      x: 900,
      y: 900,
    });

    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });
});

describe('scaling the layers inside the box', () => {
  const initial = { x: 0, y: 0, width: 100, height: 100 };
  const next = { x: 0, y: 0, width: 200, height: 50 };

  it('takes the whole box when the layer is the box', () => {
    expect(scaleLayer({ ...initial }, initial, next)).toEqual(next);
  });

  it('keeps two layers in the same relative places', () => {
    const a = scaleLayer(
      { x: 0, y: 0, width: 50, height: 100 },
      initial,
      next
    );
    const b = scaleLayer(
      { x: 50, y: 0, width: 50, height: 100 },
      initial,
      next
    );

    expect(a.x + a.width).toBeCloseTo(b.x);
    expect(a.width).toBeCloseTo(b.width);
  });

  it('scales the points of a segment with its box', () => {
    const scaled = scaleLayer(
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        points: [
          [0, 0],
          [100, 100],
        ],
      },
      initial,
      next
    );

    expect(scaled.points).toEqual([
      [0, 0],
      [200, 50],
    ]);
  });

  it('mirrors the points when the box is turned inside out', () => {
    const scaled = scaleLayer(
      {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        points: [
          [0, 0],
          [100, 50],
        ],
      },
      initial,
      { x: 0, y: 0, width: 100, height: 100 },
      { flipX: true, flipY: false }
    );

    expect(scaled.points).toEqual([
      [100, 0],
      [0, 50],
    ]);
  });

  it('keeps the pressure of a freehand point', () => {
    const scaled = scaleLayer(
      { x: 0, y: 0, width: 100, height: 100, points: [[10, 10, 0.7]] },
      initial,
      next
    );

    expect(scaled.points?.[0][2]).toBe(0.7);
  });

  it('survives a selection with no width', () => {
    const scaled = scaleLayer(
      { x: 0, y: 0, width: 0, height: 10 },
      { x: 0, y: 0, width: 0, height: 10 },
      { x: 5, y: 0, width: 0, height: 20 }
    );

    expect(Number.isNaN(scaled.x)).toBe(false);
    expect(Number.isNaN(scaled.width)).toBe(false);
  });
});

describe('reordering the paint list', () => {
  const applyMoves = (ids: string[], moves: OrderMove[]) => {
    const list = [...ids];

    for (const { from, to } of moves) {
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
    }

    return list;
  };

  const ids = ['a', 'b', 'c', 'd', 'e'];
  const reorder = (selection: string[], direction: Parameters<typeof orderMoves>[2]) =>
    applyMoves(ids, orderMoves(ids, selection, direction));

  it('sends one layer all the way back', () => {
    expect(reorder(['d'], 'back')).toEqual(['d', 'a', 'b', 'c', 'e']);
  });

  it('brings one layer all the way forward', () => {
    expect(reorder(['b'], 'front')).toEqual(['a', 'c', 'd', 'e', 'b']);
  });

  it('moves a layer one step at a time', () => {
    expect(reorder(['c'], 'backward')).toEqual(['a', 'c', 'b', 'd', 'e']);
    expect(reorder(['c'], 'forward')).toEqual(['a', 'b', 'd', 'c', 'e']);
  });

  it('keeps a multi selection together and in order', () => {
    expect(reorder(['b', 'd'], 'back')).toEqual(['b', 'd', 'a', 'c', 'e']);
    expect(reorder(['a', 'c'], 'front')).toEqual(['b', 'd', 'e', 'a', 'c']);
  });

  it('stacks a multi selection without swallowing its own members', () => {
    expect(reorder(['b', 'c'], 'backward')).toEqual(['b', 'c', 'a', 'd', 'e']);
    expect(reorder(['c', 'd'], 'forward')).toEqual(['a', 'b', 'e', 'c', 'd']);
  });

  it('does nothing at the ends of the list', () => {
    expect(orderMoves(ids, ['a'], 'backward')).toEqual([]);
    expect(orderMoves(ids, ['e'], 'forward')).toEqual([]);
    expect(orderMoves(ids, ['a'], 'back')).toEqual([]);
    expect(orderMoves(ids, ['e'], 'front')).toEqual([]);
  });

  it('does nothing with nothing selected, or everything selected', () => {
    expect(orderMoves(ids, [], 'front')).toEqual([]);
    expect(orderMoves(ids, ids, 'front')).toEqual([]);
  });

  it('never loses or duplicates a layer', () => {
    const directions = ['back', 'backward', 'forward', 'front'] as const;

    for (const direction of directions) {
      for (const selection of [['a'], ['c'], ['b', 'd'], ['a', 'b', 'e']]) {
        const result = reorder(selection, direction);

        expect(result).toHaveLength(ids.length);
        expect(new Set(result)).toEqual(new Set(ids));
      }
    }
  });
});

describe('resolving a shape style', () => {
  const base = {
    fill: { r: 255, g: 0, b: 0 },
    stroke: { r: 0, g: 0, b: 255 },
    width: 100,
    height: 80,
  };

  it('paints nothing behind a transparent shape', () => {
    expect(shapeStyle({ ...base, filled: false }).fill).toBe('none');
  });

  it('keeps a legacy layer filled', () => {
    expect(shapeStyle(base).fill).toBe('#ff0000');
  });

  it('outlines with the stroke colour, falling back to the fill', () => {
    expect(shapeStyle(base).stroke).toBe('#0000ff');
    expect(shapeStyle({ fill: base.fill }).stroke).toBe('#ff0000');
  });

  it('only produces a dash pattern for a dashed or dotted style', () => {
    expect(shapeStyle({ ...base, strokeStyle: 'solid' }).strokeDasharray)
      .toBeUndefined();
    expect(
      shapeStyle({ ...base, strokeStyle: 'dashed' }).strokeDasharray
    ).toBeTruthy();
  });

  it('rounds the corners only when asked, never past a quarter of the side', () => {
    expect(shapeStyle({ ...base, edges: 'sharp' }).radius).toBe(0);
    expect(shapeStyle({ ...base, edges: 'round' }).radius).toBe(20);
    expect(
      shapeStyle({ ...base, edges: 'round', width: 4000, height: 4000 }).radius
    ).toBe(24);
  });

  it('never rounds a corner on a shape with no size', () => {
    expect(
      shapeStyle({ ...base, edges: 'round', width: 0, height: 0 }).radius
    ).toBe(0);
  });

  it('turns the percentage from the panel into an svg opacity', () => {
    expect(shapeStyle({ ...base, opacity: 40 }).opacity).toBeCloseTo(0.4);
    expect(shapeStyle(base).opacity).toBe(1);
  });
});

describe('the eraser sweeps a path, not a point', () => {
  const layers = new Map<string, Layer>([
    ['left', shape(LayerType.Rectangle, { x: 0, y: 0, width: 40, height: 40 })],
    [
      'middle',
      shape(LayerType.Rectangle, { x: 200, y: 0, width: 40, height: 40 }),
    ],
    [
      'right',
      shape(LayerType.Rectangle, { x: 400, y: 0, width: 40, height: 40 }),
    ],
    [
      'away',
      shape(LayerType.Rectangle, { x: 200, y: 500, width: 40, height: 40 }),
    ],
  ]);
  const ids = ['left', 'middle', 'right', 'away'];

  it('catches everything a fast flick passes over', () => {
    const hit = hitsAlongSegment(
      ids,
      layers,
      { x: 10, y: 20 },
      { x: 430, y: 20 }
    );

    expect(hit.sort()).toEqual(['left', 'middle', 'right']);
  });

  it('leaves alone what the stroke never touched', () => {
    const hit = hitsAlongSegment(
      ids,
      layers,
      { x: 10, y: 20 },
      { x: 430, y: 20 }
    );

    expect(hit).not.toContain('away');
  });

  it('works for a stroke that has not moved yet', () => {
    const hit = hitsAlongSegment(
      ids,
      layers,
      { x: 210, y: 20 },
      { x: 210, y: 20 }
    );

    expect(hit).toEqual(['middle']);
  });

  it('marks a shape only once however slowly it is crossed', () => {
    const hit = hitsAlongSegment(
      ids,
      layers,
      { x: 200, y: 20 },
      { x: 240, y: 20 }
    );

    expect(hit).toEqual(['middle']);
  });

  it('stays bounded for an absurdly long stroke', () => {
    const hit = hitsAlongSegment(
      ids,
      layers,
      { x: -100000, y: 20 },
      { x: 100000, y: 20 }
    );

    expect(Array.isArray(hit)).toBe(true);
  });

  it('reaches further with a wider nib', () => {
    const near = { x: 20, y: 55 };

    expect(hitsAlongSegment(ids, layers, near, near, 4)).toEqual([]);
    expect(hitsAlongSegment(ids, layers, near, near, 20)).toEqual(['left']);
  });
});

describe('a freehand stroke can be picked up again', () => {
  /* Built with the same helper the pen uses, so the relative-point convention
     is exercised end to end rather than assumed. */
  const drawn = penPointsToPathLayer(
    [
      [300, 200, 0.5],
      [340, 260, 0.5],
      [420, 210, 0.5],
    ],
    INK
  );
  const stroke = { ...drawn, strokeWidth: 4 } as Layer;
  const ids = ['stroke'];
  const layers = new Map<string, Layer>([['stroke', stroke]]);

  it('stores its points relative to its own box', () => {
    expect(stroke.x).toBe(300);
    expect(stroke.y).toBe(200);
    expect((stroke as { points: number[][] }).points[0]).toEqual([0, 0, 0.5]);
  });

  it('is hit where the ink actually is', () => {
    expect(hitsLayer(stroke, { x: 300, y: 200 })).toBe(true);
    expect(hitsLayer(stroke, { x: 340, y: 260 })).toBe(true);
  });

  it('is not hit across the empty inside of its box', () => {
    expect(hitsLayer(stroke, { x: 360, y: 205 })).toBe(false);
  });

  it('is swept up by an eraser stroke crossing it', () => {
    const hit = hitsAlongSegment(
      ids,
      layers,
      { x: 250, y: 230 },
      { x: 470, y: 230 }
    );

    expect(hit).toEqual(['stroke']);
  });

  it('reaches the edge of a thick nib, not just the centre line', () => {
    const thick = { ...stroke, strokeWidth: 8 } as Layer;
    const edge = { x: 300, y: 200 - 14 };

    expect(hitsLayer(thick, edge)).toBe(true);
    expect(hitsLayer({ ...stroke, strokeWidth: 1 } as Layer, edge)).toBe(false);
  });
});

describe('a layer can never collapse to nothing', () => {
  it('keeps a side on a perfectly horizontal drag', () => {
    const { box } = layerBoxFromDrag({ x: 0, y: 100 }, { x: 300, y: 100 });

    expect(box.width).toBe(300);
    expect(box.height).toBeGreaterThanOrEqual(MIN_LAYER_SIZE);
  });

  it('keeps a side on a perfectly vertical drag', () => {
    const { box } = layerBoxFromDrag({ x: 100, y: 0 }, { x: 100, y: 300 });

    expect(box.width).toBeGreaterThanOrEqual(MIN_LAYER_SIZE);
    expect(box.height).toBe(300);
  });

  it('keeps a side when a handle is dragged onto the opposite edge', () => {
    const bounds = { x: 100, y: 100, width: 200, height: 100 };
    const { box } = resizeBox(bounds, Side.Left, { x: 300, y: 0 });

    expect(box.width).toBeGreaterThanOrEqual(MIN_LAYER_SIZE);
  });

  it('can still be scaled back up afterwards', () => {
    const flat = { x: 0, y: 0, width: 200, height: MIN_LAYER_SIZE };
    const grown = scaleLayer(flat, flat, { x: 0, y: 0, width: 200, height: 80 });

    expect(grown.height).toBe(80);
  });
});
