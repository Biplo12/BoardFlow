import React from 'react';

import Hint from '@/components/common/Hint';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  src: string;
  name: string;
  fallback: string;
  borderColor?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  fallback,
  borderColor,
}): JSX.Element => {
  return (
    <Hint label={name} side='bottom' sideOffset={18}>
      <Avatar className='h-8 w-8 border-2' style={{ borderColor }}>
        <AvatarImage src={src} />
        <AvatarFallback className='text-xs font-semibold'>
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
export default UserAvatar;
