import { MousePointer2 } from 'lucide-react';
import React, { memo } from 'react';

import { randomBorderColor } from '@/lib/utils';

import { useOther } from '@/liveblocks.config';

interface CursorProps {
  connectionId: number;
}

const Cursor: React.FC<CursorProps> = memo(({ connectionId }) => {
  const info = useOther(connectionId, (user) => user?.info);
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  const name = info?.name || 'Teammate';

  if (!cursor) {
    return null;
  }

  const { x, y } = cursor;

  return (
    <foreignObject
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      height={50}
      width={name.length * 10 + 24}
      className='relative drop-shadow-md'
    >
      <MousePointer2
        className='h-5 w-5'
        style={{
          fill: randomBorderColor(connectionId),
          color: randomBorderColor(connectionId),
        }}
      />
      <div
        className='absolute left-5 rounded-md px-1.5 py-0.5 text-xs font-semibold text-white'
        style={{ backgroundColor: randomBorderColor(connectionId) }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = 'Cursor';

export default Cursor;
