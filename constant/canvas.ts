import { Color, EdgeStyle, StrokeStyle } from '@/types/TCanvasState';

export const STROKE_COLORS: Color[] = [
  { r: 30, g: 30, b: 30 },
  { r: 224, g: 49, b: 49 },
  { r: 47, g: 158, b: 68 },
  { r: 25, g: 113, b: 194 },
  { r: 240, g: 140, b: 0 },
];

export const BACKGROUND_COLORS: (Color | null)[] = [
  null,
  { r: 255, g: 201, b: 201 },
  { r: 178, g: 242, b: 187 },
  { r: 165, g: 216, b: 255 },
  { r: 255, g: 236, b: 153 },
];

export const STROKE_WIDTHS = [2, 4, 8] as const;

export const STROKE_STYLES: StrokeStyle[] = ['solid', 'dashed', 'dotted'];

export const EDGE_STYLES: EdgeStyle[] = ['sharp', 'round'];

/* Dash pattern scales with the stroke so a thick dashed line still reads as
   dashes rather than a solid rule. */
export function strokeDashArray(style: StrokeStyle, width: number) {
  if (style === 'dashed') return `${width * 3} ${width * 2}`;
  if (style === 'dotted') return `0 ${width * 2}`;
  return undefined;
}

export const OPACITY_MIN = 0;
export const OPACITY_MAX = 100;

export const MIN_DRAG_TO_SIZE = 6;

/* An outline is a few pixels wide; the grab area around it is not. */
export const HIT_STROKE_PADDING = 12;

export const DEFAULT_SHAPE_SIZE = 120;

export type CanvasStyle = {
  stroke: Color;
  background: Color | null;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  edges: EdgeStyle;
  opacity: number;
};

export const DEFAULT_STYLE: CanvasStyle = {
  stroke: STROKE_COLORS[0],
  background: null,
  strokeWidth: STROKE_WIDTHS[1],
  strokeStyle: 'solid',
  edges: 'round',
  opacity: OPACITY_MAX,
};
