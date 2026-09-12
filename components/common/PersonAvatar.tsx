import Image from 'next/image';
import React from 'react';

import { cn, peepFace } from '@/lib/utils';

interface PersonAvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  seed: string | number;
}

/* Forwards the ref and everything else it is handed, so a tooltip or a menu
   can use the avatar itself as the trigger. */
const PersonAvatar = React.forwardRef<HTMLSpanElement, PersonAvatarProps>(
  ({ seed, className, style, ...props }, ref): JSX.Element => {
    const { face, tint } = peepFace(seed);

    return (
      <span
        ref={ref}
        className={cn(
          'relative block h-10 w-10 shrink-0 overflow-hidden rounded-[32%]',
          className
        )}
        style={{ backgroundColor: tint, ...style }}
        {...props}
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
  }
);

PersonAvatar.displayName = 'PersonAvatar';
export default PersonAvatar;
