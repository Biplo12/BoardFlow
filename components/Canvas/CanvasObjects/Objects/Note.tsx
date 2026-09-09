import { Kalam } from 'next/font/google';
import React, { useEffect, useRef } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import {
  calculateFontSize,
  cn,
  colorToCss,
  getContrastingTextColor,
  htmlToPlainText,
  plainTextToHtml,
} from '@/lib/utils';
import useUpdateValue from '@/hooks/useUpdateValue';

import { NoteLayer } from '@/types/TCanvasState';

const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
});

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Note: React.FC<NoteProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element => {
  const { x, y, width, height, fill, opacity, value = '' } = layer;

  const { updateValue } = useUpdateValue();
  const editable = useRef<HTMLElement>(
    null
  ) as React.RefObject<HTMLElement>;

  /* A fresh note is placed to be written on, so it takes the caret at once. */
  useEffect(() => {
    if (!editable.current?.textContent) {
      editable.current?.focus({ preventScroll: true });
    }
  }, []);

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
      opacity={(opacity ?? 100) / 100}
      style={{ backgroundColor: colorToCss(fill) }}
      className='shadow-md drop-shadow-xl'
    >
      <ContentEditable
        innerRef={editable}
        html={plainTextToHtml(value)}
        onChange={handleContentChange}
        onPaste={handlePaste}
        className={cn(
          'flex h-full w-full items-center justify-center text-center outline-none',
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: getContrastingTextColor(fill),
        }}
      />
    </foreignObject>
  );
};
export default Note;
