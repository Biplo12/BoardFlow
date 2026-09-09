import React from 'react';

import { MAX_CORNER_RADIUS } from '@/lib/canvas-style';
import { colorToCss, DEFAULT_FILLS } from '@/lib/utils';

import { CanvasStyle, strokeDashArray } from '@/constant/canvas';

import { LayerType, Point } from '@/types/TCanvasState';

interface InsertPreviewProps {
  layerType: LayerType;
  origin: Point;
  current: Point;
  style: CanvasStyle;
}

/* Ghost of the shape being dragged out, so the size is visible before the
   pointer is released. It resolves colours the same way the real layer will. */
const InsertPreview: React.FC<InsertPreviewProps> = ({
  layerType,
  origin,
  current,
  style,
}): JSX.Element | null => {
  const x = Math.min(origin.x, current.x);
  const y = Math.min(origin.y, current.y);
  const width = Math.abs(current.x - origin.x);
  const height = Math.abs(current.y - origin.y);

  if (width < 1 && height < 1) {
    return null;
  }

  const isNote = layerType === LayerType.Note;

  const common = {
    stroke: colorToCss(style.stroke),
    strokeWidth: style.strokeWidth,
    strokeDasharray: strokeDashArray(style.strokeStyle, style.strokeWidth),
    fill: isNote
      ? colorToCss(style.background ?? DEFAULT_FILLS.note)
      : style.background
        ? colorToCss(style.background)
        : 'none',
    opacity: style.opacity / 100,
    pointerEvents: 'none' as const,
  };

  if (layerType === LayerType.Ellipse) {
    return (
      <ellipse
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width / 2}
        ry={height / 2}
        {...common}
      />
    );
  }

  if (layerType === LayerType.Diamond) {
    return (
      <polygon
        points={`${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`}
        {...common}
      />
    );
  }

  if (layerType === LayerType.Arrow || layerType === LayerType.Line) {
    return (
      <line
        x1={origin.x}
        y1={origin.y}
        x2={current.x}
        y2={current.y}
        {...common}
        fill='none'
        strokeLinecap='round'
      />
    );
  }

  const radius =
    style.edges === 'round'
      ? Math.max(0, Math.min(MAX_CORNER_RADIUS, width / 4, height / 4))
      : 0;

  return (
    <rect x={x} y={y} width={width} height={height} rx={radius} {...common} />
  );
};
export default InsertPreview;
