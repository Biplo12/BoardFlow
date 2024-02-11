/* eslint-disable unused-imports/no-unused-vars */
import React, { memo } from 'react';

import useBounds from '@/hooks/useBounds';
import useCanvas from '@/hooks/useCanvas';

import ColorPicker from '@/components/Canvas/SelectionTools/Tools/ColorPicker';

import { TCanvasState } from '@/types/TCanvasState';

interface SelectionToolsProps {
  setCanvasState: (newState: TCanvasState) => void;
  canvasState: TCanvasState;
}

const SelectionTools: React.FC<SelectionToolsProps> = memo(
  ({ setCanvasState, canvasState }) => {
    const { camera, setLastUsedColor } = useCanvas({
      setCanvasState,
      canvasState,
    });

    const { bounds } = useBounds();

    if (!bounds) {
      return null;
    }

    const x = bounds.width / 2 + bounds.x + camera.x;
    const y = bounds.y + camera.y;

    return (
      <div
        className='absolute flex select-none rounded-xl border bg-white p-3 shadow-sm'
        style={{
          transform: `translate(
          calc(${x}px - 50%),
          calc(${y - 16}px - 100%)
        )`,
        }}
      >
        <ColorPicker setLastUsedColor={setLastUsedColor} />
      </div>
    );
  }
);

SelectionTools.displayName = 'SelectionTools';

export default SelectionTools;
