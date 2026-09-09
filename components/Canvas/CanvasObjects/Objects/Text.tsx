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
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

const Text: React.FC<TextProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element => {
  const { x, y, width, height, fill, stroke, opacity, value = '' } = layer;

  const { updateValue, discardIfEmpty } = useUpdateValue();
  const editable = useRef<HTMLElement>(
    null
  ) as React.RefObject<HTMLElement>;

  /* A fresh text box is placed to be typed into, so it takes the caret the
     moment it appears. */
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
    >
      <ContentEditable
        innerRef={editable}
        html={plainTextToHtml(value)}
        onChange={handleContentChange}
        onBlur={() => discardIfEmpty(id)}
        onPaste={handlePaste}
        className={cn(
          'flex h-full w-full items-center justify-center text-center outline-none',
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: colorToCss(stroke ?? fill),
        }}
      />
    </foreignObject>
  );
};
export default Text;
