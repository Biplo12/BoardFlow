import { colorToCss } from '@/lib/utils';

import { strokeDashArray } from '@/constant/canvas';

import { LayerStyle } from '@/types/TCanvasState';

export const MAX_CORNER_RADIUS = 24;

export type ResolvedStyle = {
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity: number;
  radius: number;
};

/* Boards drawn before the style panel existed have only a fill, so a missing
   flag has to keep meaning filled. */
export function isFilled(layer: LayerStyle) {
  return layer.filled !== false;
}

export function shapeStyle(
  layer: LayerStyle & { width?: number; height?: number }
): ResolvedStyle {
  const strokeWidth = layer.strokeWidth ?? 2;
  const rounded = layer.edges === 'round';
  const width = layer.width ?? 0;
  const height = layer.height ?? 0;

  return {
    fill: isFilled(layer) ? colorToCss(layer.fill) : 'none',
    stroke: colorToCss(layer.stroke ?? layer.fill),
    strokeWidth,
    strokeDasharray: strokeDashArray(layer.strokeStyle ?? 'solid', strokeWidth),
    opacity: (layer.opacity ?? 100) / 100,
    radius: rounded
      ? Math.max(0, Math.min(MAX_CORNER_RADIUS, width / 4, height / 4))
      : 0,
  };
}
