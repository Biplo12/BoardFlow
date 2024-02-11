/* eslint-disable unused-imports/no-unused-vars */
import React, { memo } from 'react';

import useBounds from '@/hooks/useBounds';

import { useSelf, useStorage } from '@/liveblocks.config';

import { LayerType, Side, XYWH } from '@/types/TCanvasState';

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

const SelectionBox: React.FC<SelectionBoxProps> = memo(
  ({ onResizeHandlePointerDown }) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const { bounds } = useBounds();

    if (!bounds) {
      return null;
    }

    const handlePositions = [
      {
        cursor: 'nwse-resize',
        side: Side.Top + Side.Left,
        x: bounds.x - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2,
      },
      {
        cursor: 'ns-resize',
        side: Side.Top,
        x: bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2,
      },
      {
        cursor: 'nesw-resize',
        side: Side.Top + Side.Right,
        x: bounds.x - HANDLE_WIDTH / 2 + bounds.width,
        y: bounds.y - HANDLE_WIDTH / 2,
      },
      {
        cursor: 'ew-resize',
        side: Side.Right,
        x: bounds.x - HANDLE_WIDTH / 2 + bounds.width,
        y: bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2,
      },
      {
        cursor: 'nwse-resize',
        side: Side.Bottom + Side.Right,
        x: bounds.x - HANDLE_WIDTH / 2 + bounds.width,
        y: bounds.y - HANDLE_WIDTH / 2 + bounds.height,
      },
      {
        cursor: 'ns-resize',
        side: Side.Bottom,
        x: bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2 + bounds.height,
      },
      {
        cursor: 'nesw-resize',
        side: Side.Bottom + Side.Left,
        x: bounds.x - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2 + bounds.height,
      },
      {
        cursor: 'ew-resize',
        side: Side.Left,
        x: bounds.x - HANDLE_WIDTH / 2,
        y: bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2,
      },
    ];

    return (
      <>
        <rect
          className='pointer-events-none fill-transparent stroke-blue-500 stroke-1'
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {isShowingHandles && (
          <>
            {handlePositions.map((handle, index) => (
              <rect
                key={index}
                className='fill-white stroke-blue-500 stroke-1'
                x={0}
                y={0}
                style={{
                  cursor: handle.cursor,
                  width: `${HANDLE_WIDTH}px`,
                  height: `${HANDLE_WIDTH}px`,
                  transform: `translate(${handle.x}px, ${handle.y}px)`,
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onResizeHandlePointerDown(handle.side, bounds);
                }}
              />
            ))}
          </>
        )}
      </>
    );
  }
);

SelectionBox.displayName = 'SelectionBox';

export default SelectionBox;
