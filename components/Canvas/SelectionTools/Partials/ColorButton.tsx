import React from 'react';

import { colorToCss } from '@/lib/utils';

import { Color } from '@/types/TCanvasState';

interface ColorButtonProps {
  color: Color;
  handler: (color: Color) => void;
}

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  handler,
}): JSX.Element => {
  return (
    <button
      className='flex h-8 w-8 items-center justify-center transition hover:opacity-75'
      onClick={() => handler(color)}
    >
      <div
        className='h-8 w-8 rounded-md border border-neutral-300'
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};
export default ColorButton;
