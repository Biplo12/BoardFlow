import { Kalam } from 'next/font/google';
import React, { useEffect, useRef } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import {
  calculateFontSize,
  cn,
  colorToCss,
  htmlToPlainText,
  plainTextToHtml,
} from '@/lib/utils';
import useUpdateValue from '@/hooks/useUpdateValue';

import { TextLayer } from '@/types/TCanvasState';

const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
});

interface TextProps {
  id: string;
  layer: TextLayer;
  isEditing: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onEdit: (id: string) => void;
  onStopEditing: () => void;
}

const Text: React.FC<TextProps> = ({
  id,
  layer,
  isEditing,
  onPointerDown,
  onEdit,
  onStopEditing,
}): JSX.Element => {
  const { x, y, width, height, fill, stroke, opacity, value = '' } = layer;

  const { updateValue, discardIfEmpty } = useUpdateValue();
  const editable = useRef<HTMLElement>(
    null
  ) as React.RefObject<HTMLElement>;

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

  const handleBlur = () => {
    onStopEditing();
    discardIfEmpty(id);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      onDoubleClick={() => onEdit(id)}
      opacity={(opacity ?? 100) / 100}
    >
      {/* Editable only while it is being edited: a permanently editable box
          would take the caret on a single click, and every keyboard shortcut
          on the board would go to it instead. */}
      <ContentEditable
        innerRef={editable}
        disabled={!isEditing}
        html={plainTextToHtml(value)}
        onChange={handleContentChange}
        onBlur={handleBlur}
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
          color: colorToCss(stroke ?? fill),
          cursor: isEditing ? 'text' : 'inherit',
          userSelect: isEditing ? 'text' : 'none',
        }}
      />
    </foreignObject>
  );
};
export default Text;
