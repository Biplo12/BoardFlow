/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { cn, colorToCss } from '@/lib/utils';

import { Color } from '@/types/TCanvasState';

interface ColorButtonProps {
  color: Color;
  handler: (color: Color) => void;
  lastUsedColor?: Color;
}

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  handler,
  lastUsedColor,
}): JSX.Element => {
  return (
    <button
      className='flex h-8 w-8 items-center justify-center transition hover:opacity-75'
      onClick={() => handler(color)}
      style={{
        opacity: lastUsedColor === color ? 1 : 0.75,
      }}
    >
      <div
        className={cn(
          'h-8 w-8 rounded-md border border-neutral-300',
          lastUsedColor === color && 'border-2 border-neutral-600'
        )}
        style={{
          background: colorToCss(color),
        }}
      />
    </button>
  );
};
export default ColorButton;
