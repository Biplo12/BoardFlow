import { Kalam } from 'next/font/google';
import React, { useEffect, useRef } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { shapeStyle } from '@/lib/canvas-style';
import {
  calculateFontSize,
  cn,
  colorToCss,
  getContrastingTextColor,
  htmlToPlainText,
  plainTextToHtml,
} from '@/lib/utils';
import useUpdateValue from '@/hooks/useUpdateValue';

import { NoteLayer, StrokeStyle } from '@/types/TCanvasState';

const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
});

const BORDER_STYLES: Record<StrokeStyle, string> = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
};

interface NoteProps {
  id: string;
  layer: NoteLayer;
  isEditing: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onEdit: (id: string) => void;
  onStopEditing: () => void;
}

const Note: React.FC<NoteProps> = ({
  id,
  layer,
  isEditing,
  onPointerDown,
  onEdit,
  onStopEditing,
}): JSX.Element => {
  const { x, y, width, height, fill, value = '' } = layer;

  const { updateValue } = useUpdateValue();
  const style = shapeStyle(layer);
  const editable = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;

  useEffect(() => {
    if (isEditing) {
      editable.current?.focus({ preventScroll: true });
    }
  }, [isEditing]);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(htmlToPlainText(e.target.value), id);
  };

  /* Paste as plain text so a copied web page cannot push its markup into
     shared board storage. */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => onEdit(id)}
      opacity={style.opacity}
    >
      {/* The paper carries the outline the panel writes, so a note looks the
          same committed as it did while it was being dragged out. */}
      <div
        className='h-full w-full shadow-md drop-shadow-xl'
        style={{
          backgroundColor: colorToCss(fill),
          border: `${style.strokeWidth}px ${BORDER_STYLES[layer.strokeStyle ?? 'solid']} ${style.stroke}`,
          borderRadius: style.radius,
        }}
      >
        {/* Editable only while it is being edited: a permanently editable box
            would take the caret on a single click, and every keyboard
            shortcut on the board would go to it instead. */}
        <ContentEditable
          innerRef={editable}
          disabled={!isEditing}
          html={plainTextToHtml(value)}
          onChange={handleContentChange}
          onBlur={onStopEditing}
          onPaste={handlePaste}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              editable.current?.blur();
            }
          }}
          className={cn(
            'flex h-full w-full items-center justify-center text-center outline-none',
            font.className
          )}
          style={{
            fontSize: calculateFontSize(width, height),
            color: getContrastingTextColor(fill),
            cursor: isEditing ? 'text' : 'inherit',
            userSelect: isEditing ? 'text' : 'none',
          }}
        />
      </div>
    </foreignObject>
  );
};
export default Note;
