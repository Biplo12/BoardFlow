/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { colors } from '@/lib/utils';
import useIsObjectSelected from '@/hooks/useIsObjectSelected';

import ColorButton from '@/components/Canvas/SelectionTools/Partials/ColorButton';

import { useMutation, useSelf } from '@/liveblocks.config';

import { Color, LayerType } from '@/types/TCanvasState';

interface ColorPickerProps {
  setLastUsedColor: (color: Color) => void;
  lastUsedColor?: Color;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  setLastUsedColor,
  lastUsedColor,
}): JSX.Element => {
  const selection = useSelf((me) => me.presence.selection);

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

  const isImageSelected = useIsObjectSelected(LayerType.Image);

  return (
    <div className='flex max-w-[165px] flex-wrap items-center justify-center gap-2'>
      {colors.map((color, index) => (
        <ColorButton
          key={index}
          color={color}
          handler={setFill}
          lastUsedColor={lastUsedColor}
          disabled={isImageSelected}
        />
      ))}
    </div>
  );
};
export default ColorPicker;
