import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
} from '@/types/TCanvasState';

const BORDER_COLORS = ['#dc2626', '#059669', '#2563eb', '#d97706', '#d97706'];

export const colors = [
  { r: 243, g: 82, b: 35 },
  { r: 255, g: 249, b: 177 },
  { r: 68, g: 202, b: 99 },
  { r: 39, g: 142, b: 237 },
  { r: 155, g: 105, b: 245 },
  { r: 252, g: 142, b: 42 },
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 255, b: 255 },
];

/* Until the user picks a swatch, each kind of object gets a colour that is
   actually visible against the board rather than the white it used to take. */
export const DEFAULT_FILLS = {
  note: { r: 255, g: 249, b: 177 },
  shape: { r: 39, g: 142, b: 237 },
  ink: { r: 17, g: 17, b: 17 },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomBorderColor(index: number) {
  return BORDER_COLORS[index % BORDER_COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: (e.clientX - camera.x) / camera.scale,
    y: (e.clientY - camera.y) / camera.scale,
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
}

export function cssToColor(css: string): Color {
  const hex = css.replace('#', '');

  return {
    r: parseInt(hex.slice(0, 2), 16) || 0,
    g: parseInt(hex.slice(2, 4), 16) || 0,
    b: parseInt(hex.slice(4, 6), 16) || 0,
  };
}

export function findIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rect = {
    x: Math.min(a?.x, b.x),
    y: Math.min(a?.y, b.y),
    width: Math.abs(a?.x - b.x),
    height: Math.abs(a?.y - b.y),
  };

  const ids = [];

  for (const layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }

    const { x, y, height, width } = layer;

    if (
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
}

export function calculateFontSize(width: number, height: number) {
  const maxFontSize = 96;
  const scaleFactor = 0.5;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
}

export function getContrastingTextColor(color: Color) {
  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;

  return brightness > 125 ? '#000' : '#fff';
}

export function penPointsToPathLayer(
  points: number[][],
  color: Color
): PathLayer {
  if (points.length < 2) {
    throw new Error('Cannot transform points with less than 2 points');
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }

    if (top > y) {
      top = y;
    }

    if (right < x) {
      right = x;
    }

    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

const PEEP_FACES = [
  'ada',
  'bo',
  'cira',
  'dev',
  'emi',
  'finn',
  'gia',
  'huck',
  'iris',
  'jules',
  'kit',
  'lou',
  'mira',
  'nils',
  'ola',
  'pax',
];

const PEEP_TINTS = [
  '#ffd8e6',
  '#c9e9ff',
  '#c3e776',
  '#edf072',
  '#e3d4ff',
  '#ffe0c2',
];

const ORG_TINTS = [
  { background: '#ff3d7f', ink: '#ffffff' },
  { background: '#9466e8', ink: '#ffffff' },
  { background: '#0f8fd6', ink: '#ffffff' },
  { background: '#c3e776', ink: '#111111' },
  { background: '#ffd23f', ink: '#111111' },
  { background: '#c9e9ff', ink: '#111111' },
];

/* Same seed, same face for ever: people keep the head they were given
   without anything being stored against their account. */
export function peepFace(seed: string | number) {
  const key = String(seed);
  let hash = 2166136261;

  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return {
    face: PEEP_FACES[hash % PEEP_FACES.length],
    tint: PEEP_TINTS[(hash >>> 9) % PEEP_TINTS.length],
  };
}

export function orgTint(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return ORG_TINTS[hash % ORG_TINTS.length];
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

/* Board text is plain text. It is stored that way and escaped again on the way
   into the contenteditable, so markup pasted by one collaborator can never be
   parsed as HTML for everybody else. */
export function htmlToPlainText(html: string) {
  /* A contenteditable wraps every line after the first in its own block, so
     the opening tag is the line break, not just the closing one. */
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<(div|p|li|h[1-6])(\s[^>]*)?>/gi, '\n')
    .replace(/<\/(div|p|li|h[1-6])>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(
      /&(amp|lt|gt|quot|#39|nbsp);/gi,
      (match) => ENTITIES[match.toLowerCase()] ?? match
    )
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+$/, '');
}

export function plainTextToHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}
