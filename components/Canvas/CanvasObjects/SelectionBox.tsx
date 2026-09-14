 
import React, { memo } from 'react';

import { claimPointer, surfaceOf } from '@/lib/canvas-pointer';
import useBounds from '@/hooks/useBounds';

import { Side, XYWH } from '@/types/TCanvasState';

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
  scale?: number;
  spaceHeld: React.MutableRefObject<boolean>;
}

const BASE_HANDLE_WIDTH = 8;

const SelectionBox: React.FC<SelectionBoxProps> = memo(
  ({ onResizeHandlePointerDown, scale = 1, spaceHeld }) => {
    /* The whole surface is scaled, so handles and outlines are divided back
       out to keep the same size on screen at any zoom. */
    const HANDLE_WIDTH = BASE_HANDLE_WIDTH / scale;
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
          className='pointer-events-none fill-transparent stroke-[#0f8fd6]'
          strokeWidth={1 / scale}
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {handlePositions.map((handle, index) => (
          <rect
            key={index}
            className='fill-white stroke-[#0f8fd6]'
            strokeWidth={1 / scale}
            x={0}
            y={0}
            style={{
              cursor: handle.cursor,
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${handle.x}px, ${handle.y}px)`,
            }}
            onPointerDown={(e) => {
              /* A handle is for the left button only. Space-pan, the hand
                 tool and middle-drag have to reach the surface underneath. */
              if (e.button !== 0 || spaceHeld.current) return;

              e.stopPropagation();
              claimPointer(e, surfaceOf(e.currentTarget));
              onResizeHandlePointerDown(handle.side, bounds);
            }}
          />
        ))}
      </>
    );
  }
);

SelectionBox.displayName = 'SelectionBox';

export default SelectionBox;
