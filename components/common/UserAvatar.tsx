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
        /* The heads overlap, so the one under the pointer lifts and comes
           forward instead of staying buried. */
        className={cn(
          'relative h-12 w-12 border-[3px] border-[#111111] transition-transform duration-150 hover:z-10 hover:-translate-y-1 hover:scale-[1.06]',
          className
        )}
      />
    </Hint>
  );
};
export default UserAvatar;
