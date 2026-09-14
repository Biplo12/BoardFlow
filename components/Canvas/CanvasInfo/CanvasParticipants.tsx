import { shallow } from '@liveblocks/client';
import React from 'react';

import Hint from '@/components/common/Hint';
import UserAvatar from '@/components/common/UserAvatar';

import { useOthersMapped, useSelf } from '@/liveblocks.config';

const MAX_PARTICIPANTS = 3;

/* Selectors, not the whole presence: without them this list re-renders on
   every cursor tick of every person in the room. */
const CanvasParticipants: React.FC = (): JSX.Element => {
  const others = useOthersMapped((other) => other.info, shallow);
  const self = useSelf((me) => me.info, shallow);

  const hidden = others.slice(MAX_PARTICIPANTS);

  return (
    <div className='absolute top-3 right-3 flex items-center'>
      <div className='flex -space-x-4'>
        {self && (
          <UserAvatar name={`${self.name} (You)`} seed={self.userId} />
        )}

        {others.slice(0, MAX_PARTICIPANTS).map(([connectionId, info]) => (
          <UserAvatar
            key={connectionId}
            name={info.name}
            seed={info.userId}
          />
        ))}

        {hidden.length > 0 && (
          <Hint
            label={hidden.map(([, info]) => info.name).join(', ')}
            side='bottom'
            sideOffset={18}
          >
            <span
              className='flex h-12 w-12 items-center justify-center rounded-[32%] border-[3px] text-[14px] font-bold'
              style={{
                backgroundColor: 'var(--candy-surface)',
                borderColor: '#111111',
                color: 'var(--candy-ink)',
              }}
            >
              +{hidden.length}
            </span>
          </Hint>
        )}
      </div>
    </div>
  );
};
export default CanvasParticipants;
