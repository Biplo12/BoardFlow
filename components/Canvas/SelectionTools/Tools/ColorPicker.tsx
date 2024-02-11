/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import ColorButton from '@/components/Canvas/SelectionTools/Partials/ColorButton';

import { useMutation, useSelf } from '@/liveblocks.config';

import { Color } from '@/types/TCanvasState';

interface ColorPickerProps {
  setLastUsedColor: (color: Color) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  setLastUsedColor,
}): JSX.Element => {
  const selection = useSelf((me) => me.presence.selection);

  const colors = [
    { r: 243, g: 82, b: 35 },
    { r: 255, g: 249, b: 177 },
    { r: 68, g: 202, b: 99 },
    { r: 39, g: 142, b: 237 },
    { r: 155, g: 105, b: 245 },
    { r: 252, g: 142, b: 42 },
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 255, b: 255 },
  ];

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get('layers');
      setLastUsedColor(fill);

      selection.forEach((id) => {
        liveLayers.get(id)?.set('fill', fill);
      });
    },
    [selection, setLastUsedColor]
  );

  return (
    <div className='mr-2 flex max-w-[165px] flex-wrap items-center gap-2 border-r border-neutral-200 pr-2'>
      {colors.map((color, index) => (
        <ColorButton key={index} color={color} handler={setFill} />
      ))}
    </div>
  );
};
export default ColorPicker;
