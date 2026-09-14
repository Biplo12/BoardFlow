import React from 'react';

import { arrowHead } from '@/lib/canvas-geometry';
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
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
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
    const shaft = {
      x1: origin.x,
      y1: origin.y,
      x2: current.x,
      y2: current.y,
    };

    if (layerType === LayerType.Line) {
      return <line {...shaft} {...common} fill='none' strokeLinecap='round' />;
    }

    const [left, right] = arrowHead(origin, current, style.strokeWidth);
    const barb = {
      stroke: common.stroke,
      strokeWidth: common.strokeWidth,
      strokeLinecap: 'round' as const,
      pointerEvents: 'none' as const,
    };

    return (
      <g opacity={common.opacity}>
        <line
          {...shaft}
          stroke={common.stroke}
          strokeWidth={common.strokeWidth}
          strokeDasharray={common.strokeDasharray}
          fill='none'
          strokeLinecap='round'
          pointerEvents='none'
        />
        <line
          x1={current.x}
          y1={current.y}
          x2={left.x}
          y2={left.y}
          {...barb}
        />
        <line
          x1={current.x}
          y1={current.y}
          x2={right.x}
          y2={right.y}
          {...barb}
        />
      </g>
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
