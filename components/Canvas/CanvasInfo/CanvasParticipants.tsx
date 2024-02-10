import React from 'react';

import { randomBorderColor } from '@/lib/utils';

import UserAvatar from '@/components/common/UserAvatar';

import { useOthers, useSelf } from '@/liveblocks.config';

const MAX_PARTICIPANTS = 2;

const CanvasParticipants: React.FC = (): JSX.Element => {
  const users = useOthers();
  const self = useSelf();

  const isMaxParticipants = users.length >= MAX_PARTICIPANTS;

  return (
    <div className='absolute right-2 top-2 flex h-12 items-center rounded-md bg-white p-3 shadow-md'>
      <div className='flex gap-2'>
        {users
          .slice(0, MAX_PARTICIPANTS)
          .map(({ info: user, connectionId }) => (
            <UserAvatar
              key={connectionId}
              src={user.picture}
              name={user.name}
              fallback={user.name[0] || 'T'}
              borderColor={randomBorderColor(connectionId)}
            />
          ))}

        {self && (
          <UserAvatar
            src={self.info.picture}
            name={`${self.info.name} (You)`}
            fallback={self.info.name[0] || 'T'}
            borderColor={randomBorderColor(self.connectionId)}
          />
        )}

        {isMaxParticipants && (
          <UserAvatar
            src=''
            name={`+${users.length - MAX_PARTICIPANTS} more`}
            fallback={`+${users.length - MAX_PARTICIPANTS}`}
          />
        )}
      </div>
    </div>
  );
};
export default CanvasParticipants;
