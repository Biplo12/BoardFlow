/* eslint-disable unused-imports/no-unused-vars */
import { BringToFront, SendToBack, Trash2 } from 'lucide-react';
import React, { memo } from 'react';

import useBounds from '@/hooks/useBounds';
import useCanvas from '@/hooks/useCanvas';
import useDeleteLayer from '@/hooks/useDeleteLayer';

import ColorPicker from '@/components/Canvas/SelectionTools/Tools/ColorPicker';
import Hint from '@/components/common/Hint';
import { Button } from '@/components/ui/button';

import { useMutation, useSelf } from '@/liveblocks.config';

interface SelectionToolsProps {
  canvasActions: ReturnType<typeof useCanvas>;
}

const SelectionTools: React.FC<SelectionToolsProps> = memo(
  ({ canvasActions }) => {
    const { camera, setLastUsedColor } = canvasActions;
    const selection = useSelf((me) => me.presence.selection);

    const moveToFront = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get('layerIds');
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = indices.length - 1; i >= 0; i--) {
          liveLayerIds.move(
            indices[i],
            arr.length - 1 - (indices.length - 1 - i)
          );
        }
      },
      [selection]
    );

    const moveToBack = useMutation(
      ({ storage }) => {
        const liveLayerIds = storage.get('layerIds');
        const indices: number[] = [];

        const arr = liveLayerIds.toImmutable();

        for (let i = 0; i < arr.length; i++) {
          if (selection.includes(arr[i])) {
            indices.push(i);
          }
        }

        for (let i = 0; i < indices.length; i++) {
          liveLayerIds.move(indices[i], i);
        }
      },
      [selection]
    );

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
        <div className='flex flex-col gap-y-0.5'>
          <Hint label='Bring to front'>
            <Button onClick={moveToFront} variant='ghost' size='icon'>
              <BringToFront />
            </Button>
          </Hint>
          <Hint label='Send to back' side='bottom'>
            <Button onClick={moveToBack} variant='ghost' size='icon'>
              <SendToBack />
            </Button>
          </Hint>
        </div>
        <div className='ml-2 flex items-center border-l border-neutral-200 pl-2'>
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
