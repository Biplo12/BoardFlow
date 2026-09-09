import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Arrow from '@/components/Canvas/CanvasObjects/Objects/Arrow';
import Diamond from '@/components/Canvas/CanvasObjects/Objects/Diamond';
import Ellipse from '@/components/Canvas/CanvasObjects/Objects/Ellipse';
import Line from '@/components/Canvas/CanvasObjects/Objects/Line';
import Path from '@/components/Canvas/CanvasObjects/Objects/Path';
import Rectangle from '@/components/Canvas/CanvasObjects/Objects/Rectangle';

import { HIT_STROKE_PADDING } from '@/constant/canvas';

import { Layer, LayerType } from '@/types/TCanvasState';

const RED = { r: 224, g: 49, b: 49 };
const BLUE = { r: 25, g: 113, b: 194 };

const noop = () => undefined;

const layer = (type: LayerType, extra: Partial<Layer> = {}) =>
  ({
    type,
    x: 10,
    y: 20,
    width: 120,
    height: 80,
    fill: BLUE,
    stroke: RED,
    strokeWidth: 4,
    strokeStyle: 'solid',
    edges: 'sharp',
    opacity: 100,
    filled: true,
    ...extra,
  }) as Layer;

const render = (component: any, props: any) =>
  renderToStaticMarkup(createElement(component, props));

const shapes: [any, LayerType, Partial<Layer>][] = [
  [Rectangle, LayerType.Rectangle, {}],
  [Ellipse, LayerType.Ellipse, {}],
  [Diamond, LayerType.Diamond, {}],
  [
    Line,
    LayerType.Line,
    {
      points: [
        [0, 0],
        [120, 80],
      ],
    },
  ],
  [
    Arrow,
    LayerType.Arrow,
    {
      points: [
        [0, 0],
        [120, 80],
      ],
    },
  ],
];

describe('every shape honours the style panel', () => {
  it.each(shapes)('paints no body for %# when the fill is off', (
    component,
    type,
    extra
  ) => {
    const markup = render(component, {
      id: 'x',
      layer: layer(type, { ...extra, filled: false }),
      onPointerDown: noop,
    });

    expect(markup).not.toContain('#1971c2');
    expect(markup).toContain('#e03131');
  });

  it.each(shapes.slice(0, 3))('fills %# from the background swatch', (
    component,
    type,
    extra
  ) => {
    const markup = render(component, {
      id: 'x',
      layer: layer(type, { ...extra }),
      onPointerDown: noop,
    });

    expect(markup).toContain('fill="#1971c2"');
  });

  it.each(shapes)('dashes %# when asked', (component, type, extra) => {
    const markup = render(component, {
      id: 'x',
      layer: layer(type, { ...extra, strokeStyle: 'dashed' }),
      onPointerDown: noop,
    });

    expect(markup).toContain('stroke-dasharray="12 8"');
  });

  it.each(shapes)('keeps %# solid by default', (component, type, extra) => {
    const markup = render(component, {
      id: 'x',
      layer: layer(type, { ...extra }),
      onPointerDown: noop,
    });

    expect(markup).not.toContain('stroke-dasharray');
  });

  it.each(shapes)('fades %# with the opacity slider', (
    component,
    type,
    extra
  ) => {
    const markup = render(component, {
      id: 'x',
      layer: layer(type, { ...extra, opacity: 40 }),
      onPointerDown: noop,
    });

    expect(markup).toContain('opacity="0.4"');
  });

  it.each(shapes)('gives %# a grab area wider than its stroke', (
    component,
    type,
    extra
  ) => {
    const markup = render(component, {
      id: 'x',
      layer: layer(type, { ...extra }),
      onPointerDown: noop,
    });

    expect(markup).toContain('stroke="transparent"');
    expect(markup).toContain(`stroke-width="${4 + HIT_STROKE_PADDING}"`);
  });
});

describe('shape geometry', () => {
  it('rounds a rectangle only when the edges say so', () => {
    const sharp = render(Rectangle, {
      id: 'x',
      layer: layer(LayerType.Rectangle),
      onPointerDown: noop,
    });
    const round = render(Rectangle, {
      id: 'x',
      layer: layer(LayerType.Rectangle, { edges: 'round' }),
      onPointerDown: noop,
    });

    expect(sharp).toContain('rx="0"');
    expect(round).toContain('rx="20"');
  });

  it('centres an ellipse in its box', () => {
    const markup = render(Ellipse, {
      id: 'x',
      layer: layer(LayerType.Ellipse),
      onPointerDown: noop,
    });

    expect(markup).toContain('cx="70"');
    expect(markup).toContain('cy="60"');
    expect(markup).toContain('rx="60"');
    expect(markup).toContain('ry="40"');
  });

  it('hangs a diamond off the midpoints of its box', () => {
    const markup = render(Diamond, {
      id: 'x',
      layer: layer(LayerType.Diamond),
      onPointerDown: noop,
    });

    expect(markup).toContain('points="70,20 130,60 70,100 10,60"');
  });

  it('draws a line between its own two points', () => {
    const markup = render(Line, {
      id: 'x',
      layer: layer(LayerType.Line, {
        points: [
          [0, 0],
          [120, 80],
        ],
      }),
      onPointerDown: noop,
    });

    expect(markup).toContain('x1="10"');
    expect(markup).toContain('y1="20"');
    expect(markup).toContain('x2="130"');
    expect(markup).toContain('y2="100"');
  });

  it('gives an arrow a head at the far end', () => {
    const markup = render(Arrow, {
      id: 'x',
      layer: layer(LayerType.Arrow, {
        points: [
          [0, 0],
          [120, 80],
        ],
      }),
      onPointerDown: noop,
    });

    expect(markup).toContain('<polygon');
    expect(markup).toContain('130,100');
  });

  it('draws nothing for a segment with one end', () => {
    expect(
      render(Line, {
        id: 'x',
        layer: layer(LayerType.Line, { points: [[0, 0]] }),
        onPointerDown: noop,
      })
    ).toBe('');
  });

  it('turns freehand points into a filled outline', () => {
    const markup = render(Path, {
      x: 0,
      y: 0,
      points: [
        [0, 0, 0.5],
        [20, 10, 0.5],
        [40, 0, 0.5],
      ],
      fill: '#111111',
      strokeWidth: 8,
    });

    expect(markup).toMatch(/d="M[^"]+"/);
    expect(markup).toContain('#111111');
  });

  it('makes a thicker pen leave a wider mark', () => {
    const points = [
      [0, 0, 0.5],
      [40, 0, 0.5],
    ];
    const thin = render(Path, { x: 0, y: 0, points, fill: '#000', strokeWidth: 2 });
    const thick = render(Path, { x: 0, y: 0, points, fill: '#000', strokeWidth: 8 });

    expect(thin).not.toBe(thick);
  });
});
