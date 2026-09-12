'use client';

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Copy,
  Link,
  Trash2,
} from 'lucide-react';
import React from 'react';

import { cn, colorToCss } from '@/lib/utils';
import { Alignment } from '@/hooks/useAlignLayers';

import {
  BACKGROUND_COLORS,
  CanvasStyle,
  EDGE_STYLES,
  STROKE_COLORS,
  STROKE_STYLES,
  STROKE_WIDTHS,
  strokeDashArray,
} from '@/constant/canvas';

import { Color, EdgeStyle, StrokeStyle } from '@/types/TCanvasState';

const SWATCH_CLASS = 'h-[26px] w-[26px] rounded-[8px] border border-black/10';
const SELECTED_CLASS = 'ring-2 ring-[color:var(--candy-ink)] ring-offset-2';
const LABEL_CLASS = 'mb-2 text-[12px] font-semibold';
const LABEL_STYLE = { color: 'var(--candy-muted)' };
const ICON_CLASS = 'h-[18px] w-[18px]';

const STROKE_STYLE_LABELS: Record<StrokeStyle, string> = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
};

const EDGE_LABELS: Record<EdgeStyle, string> = {
  sharp: 'sharp',
  round: 'round',
};

const EDGE_PATHS: Record<EdgeStyle, string> = {
  sharp: 'M5 19V5h14',
  round: 'M5 19v-6a8 8 0 0 1 8-8h6',
};

const isSameColor = (a: Color | null, b: Color | null) =>
  a === null || b === null ? a === b : colorToCss(a) === colorToCss(b);

interface CanvasStylePanelProps {
  style: CanvasStyle;
  onChange: (patch: Partial<CanvasStyle>) => void;
  visible: boolean;
  hasSelection: boolean;
  onSendToBack: () => void;
  onSendBackward: () => void;
  onBringForward: () => void;
  onBringToFront: () => void;
  onAlign: (alignment: Alignment) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSetImageUrl?: () => void;
  onSlideStart: () => void;
  onSlideEnd: () => void;
}

const CanvasStylePanel: React.FC<CanvasStylePanelProps> = ({
  style,
  onChange,
  visible,
  hasSelection,
  onSendToBack,
  onSendBackward,
  onBringForward,
  onBringToFront,
  onAlign,
  onDuplicate,
  onDelete,
  onSetImageUrl,
  onSlideStart,
  onSlideEnd,
}): JSX.Element | null => {
  if (!visible) {
    return null;
  }

  const orderActions: {
    label: string;
    Icon: React.FC<{ className?: string }>;
    handler: () => void;
  }[] = [
    { label: 'send to back', Icon: ChevronsDown, handler: onSendToBack },
    { label: 'send backward', Icon: ChevronDown, handler: onSendBackward },
    { label: 'bring forward', Icon: ChevronUp, handler: onBringForward },
    { label: 'bring to front', Icon: ChevronsUp, handler: onBringToFront },
  ];

  const alignments: {
    label: string;
    Icon: React.FC<{ className?: string }>;
    alignment: Alignment;
  }[] = [
    { label: 'left', Icon: AlignStartVertical, alignment: 'left' },
    {
      label: 'center horizontally',
      Icon: AlignCenterVertical,
      alignment: 'center-x',
    },
    { label: 'right', Icon: AlignEndVertical, alignment: 'right' },
    {
      label: 'distribute horizontally',
      Icon: AlignHorizontalDistributeCenter,
      alignment: 'distribute-x',
    },
    { label: 'top', Icon: AlignStartHorizontal, alignment: 'top' },
    {
      label: 'center vertically',
      Icon: AlignCenterHorizontal,
      alignment: 'center-y',
    },
    { label: 'bottom', Icon: AlignEndHorizontal, alignment: 'bottom' },
    {
      label: 'distribute vertically',
      Icon: AlignVerticalDistributeCenter,
      alignment: 'distribute-y',
    },
  ];

  return (
    <div className='canvas-panel absolute top-1/2 left-3 z-20 flex max-h-[calc(100vh-120px)] w-[212px] -translate-y-1/2 flex-col gap-4 overflow-y-auto p-4'>
      <div>
        <p className={LABEL_CLASS} style={LABEL_STYLE}>
          Stroke
        </p>
        <div className='flex items-center gap-2'>
          {STROKE_COLORS.map((color) => (
            <button
              key={colorToCss(color)}
              aria-label={`Stroke ${colorToCss(color)}`}
              onClick={() => onChange({ stroke: color })}
              className={cn(
                SWATCH_CLASS,
                isSameColor(style.stroke, color) && SELECTED_CLASS
              )}
              style={{ backgroundColor: colorToCss(color) }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL_CLASS} style={LABEL_STYLE}>
          Background
        </p>
        <div className='flex items-center gap-2'>
          {BACKGROUND_COLORS.map((color, index) => (
            <button
              key={color ? colorToCss(color) : index}
              aria-label={
                color ? `Background ${colorToCss(color)}` : 'Transparent background'
              }
              onClick={() => onChange({ background: color })}
              className={cn(
                SWATCH_CLASS,
                'overflow-hidden',
                isSameColor(style.background, color) && SELECTED_CLASS
              )}
              style={{ backgroundColor: color ? colorToCss(color) : '#fff' }}
            >
              {!color && (
                <svg viewBox='0 0 26 26' className='h-full w-full'>
                  <line
                    x1='4'
                    y1='22'
                    x2='22'
                    y2='4'
                    stroke='var(--candy-ink)'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL_CLASS} style={LABEL_STYLE}>
          Stroke width
        </p>
        <div className='flex items-center gap-2'>
          {STROKE_WIDTHS.map((width) => (
            <button
              key={width}
              aria-label={`Stroke width ${width}`}
              onClick={() => onChange({ strokeWidth: width })}
              data-active={style.strokeWidth === width}
              className='tool-button'
            >
              <span
                className='w-[18px] rounded-full bg-current'
                style={{ height: width }}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL_CLASS} style={LABEL_STYLE}>
          Stroke style
        </p>
        <div className='flex items-center gap-2'>
          {STROKE_STYLES.map((strokeStyle) => (
            <button
              key={strokeStyle}
              aria-label={`Stroke style ${STROKE_STYLE_LABELS[strokeStyle]}`}
              onClick={() => onChange({ strokeStyle })}
              data-active={style.strokeStyle === strokeStyle}
              className='tool-button'
            >
              <svg viewBox='0 0 24 24' className={ICON_CLASS}>
                <line
                  x1='3'
                  y1='12'
                  x2='21'
                  y2='12'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeDasharray={strokeDashArray(strokeStyle, 2)}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL_CLASS} style={LABEL_STYLE}>
          Edges
        </p>
        <div className='flex items-center gap-2'>
          {EDGE_STYLES.map((edges) => (
            <button
              key={edges}
              aria-label={`Edges ${EDGE_LABELS[edges]}`}
              onClick={() => onChange({ edges })}
              data-active={style.edges === edges}
              className='tool-button'
            >
              <svg viewBox='0 0 24 24' className={ICON_CLASS}>
                <path
                  d={EDGE_PATHS[edges]}
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={LABEL_CLASS} style={LABEL_STYLE}>
          Opacity
        </p>
        <input
          type='range'
          min={0}
          max={100}
          step={10}
          value={style.opacity}
          aria-label='Opacity'
          onPointerDown={onSlideStart}
          onPointerUp={onSlideEnd}
          onKeyDown={onSlideStart}
          onKeyUp={onSlideEnd}
          onBlur={onSlideEnd}
          onChange={(event) =>
            onChange({ opacity: Number(event.target.value) })
          }
          className='w-full'
          style={{ accentColor: 'var(--candy-pink)' }}
        />
        <div
          className='flex justify-between text-[10px] font-semibold'
          style={LABEL_STYLE}
        >
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {hasSelection && (
        <>
          <div>
            <p className={LABEL_CLASS} style={LABEL_STYLE}>
              Layers
            </p>
            <div className='flex items-center gap-1'>
              {orderActions.map(({ label, Icon, handler }) => (
                <button
                  key={label}
                  aria-label={`Layers ${label}`}
                  onClick={handler}
                  className='tool-button'
                >
                  <Icon className={ICON_CLASS} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={LABEL_CLASS} style={LABEL_STYLE}>
              Align
            </p>
            <div className='grid grid-cols-4 justify-items-center gap-1'>
              {alignments.map(({ label, Icon, alignment }) => (
                <button
                  key={alignment}
                  aria-label={`Align ${label}`}
                  onClick={() => onAlign(alignment)}
                  className='tool-button'
                >
                  <Icon className={ICON_CLASS} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={LABEL_CLASS} style={LABEL_STYLE}>
              Actions
            </p>
            <div className='flex items-center gap-2'>
              <button
                aria-label='Duplicate'
                onClick={onDuplicate}
                className='tool-button'
              >
                <Copy className={ICON_CLASS} />
              </button>
              {onSetImageUrl && (
                <button
                  aria-label='Image url'
                  onClick={onSetImageUrl}
                  className='tool-button'
                >
                  <Link className={ICON_CLASS} />
                </button>
              )}
              <button
                aria-label='Delete'
                onClick={onDelete}
                className='tool-button'
                style={{ color: 'var(--candy-pink)' }}
              >
                <Trash2 className={ICON_CLASS} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CanvasStylePanel;
