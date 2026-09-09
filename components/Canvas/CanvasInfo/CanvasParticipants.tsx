import React from 'react';

import UserAvatar from '@/components/common/UserAvatar';

import { useOthers, useSelf } from '@/liveblocks.config';

const MAX_PARTICIPANTS = 3;

const CanvasParticipants: React.FC = (): JSX.Element => {
  const users = useOthers();
  const self = useSelf();

  const overflow = users.length - MAX_PARTICIPANTS;

  return (
    <div className='absolute top-3 right-3 flex items-center'>
      <div className='flex -space-x-4'>
        {self && (
          <UserAvatar
            name={`${self.info.name} (You)`}
            seed={self.info.userId}
          />
        )}

        {users.slice(0, MAX_PARTICIPANTS).map((other) => (
          <UserAvatar
            key={other.connectionId}
            name={other.info.name}
            seed={other.info.userId}
          />
        ))}

        {overflow > 0 && (
          <span
            className='flex h-12 w-12 items-center justify-center rounded-[32%] border-[3px] text-[14px] font-bold'
            style={{
              backgroundColor: 'var(--candy-surface)',
              borderColor: '#111111',
              color: 'var(--candy-ink)',
            }}
          >
            +{overflow}
          </span>
        )}
      </div>
    </div>
  );
};
export default CanvasParticipants;
