import Image from 'next/image';
import React from 'react';

import { cn, peepFace } from '@/lib/utils';

interface PersonAvatarProps {
  seed: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  seed,
  className,
  style,
}): JSX.Element => {
  const { face, tint } = peepFace(seed);

  return (
    <span
      className={cn(
        'relative block h-10 w-10 shrink-0 overflow-hidden rounded-[32%]',
        className
      )}
      style={{ backgroundColor: tint, ...style }}
    >
      <Image
        src={`/illustrations/peeps/avatar/${face}.svg`}
        alt=''
        aria-hidden
        fill
        sizes='72px'
        className='select-none'
      />
    </span>
  );
};
export default PersonAvatar;
