import React from 'react';

import { cn } from '@/lib/utils';

import Hint from '@/components/common/Hint';
import PersonAvatar from '@/components/common/PersonAvatar';

interface UserAvatarProps {
  name: string;
  seed?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  seed,
  className,
}): JSX.Element => {
  return (
    <Hint label={name} side='bottom' sideOffset={18}>
      <PersonAvatar
        seed={seed ?? name}
        className={cn('h-12 w-12 border-[3px] border-[#111111]', className)}
      />
    </Hint>
  );
};
export default UserAvatar;
