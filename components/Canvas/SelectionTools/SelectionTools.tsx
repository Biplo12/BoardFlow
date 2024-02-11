/* eslint-disable unused-imports/no-unused-vars */
import { Trash2 } from 'lucide-react';
import React, { memo } from 'react';

import useBounds from '@/hooks/useBounds';
import useCanvas from '@/hooks/useCanvas';
import useDeleteLayer from '@/hooks/useDeleteLayer';

import ColorPicker from '@/components/Canvas/SelectionTools/Tools/ColorPicker';
import Hint from '@/components/common/Hint';
import { Button } from '@/components/ui/button';

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
    const deleteLayer = useDeleteLayer();

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
        <div className='flex items-center'>
          <Hint label='Delete'>
            <Button variant='ghost' size='icon' onClick={deleteLayer}>
              <Trash2 />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = 'SelectionTools';

export default SelectionTools;
