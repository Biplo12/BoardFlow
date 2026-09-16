import React, { memo } from 'react';

import { useStorage } from '@/liveblocks.config';

interface RemoteSelectionProps {
  layerId: string;
  color: string;
  scale: number;
}

const PADDING = 4;

/* Somebody else has this layer selected. It is drawn around the shape rather
   than on it, so the shape keeps the colours its author gave it. */
const RemoteSelection: React.FC<RemoteSelectionProps> = memo(
  ({ layerId, color, scale }) => {
    const layer = useStorage((root) => root.layers[layerId]);

    if (!layer) {
      return null;
    }

    const padding = PADDING / scale;

    return (
      <rect
        className='pointer-events-none'
        x={layer.x - padding}
        y={layer.y - padding}
        width={layer.width + padding * 2}
        height={layer.height + padding * 2}
        fill='none'
        stroke={color}
        strokeWidth={1.5 / scale}
        strokeDasharray={`${6 / scale} ${4 / scale}`}
        rx={4 / scale}
      />
    );
  }
);

RemoteSelection.displayName = 'RemoteSelection';

export default RemoteSelection;
