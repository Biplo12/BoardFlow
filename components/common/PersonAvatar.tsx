import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

const PEOPLE = [
  { face: 'ada', tint: '#ffd8e6' },
  { face: 'dev', tint: '#c9e9ff' },
  { face: 'gia', tint: '#c3e776' },
  { face: 'lou', tint: '#edf072' },
  { face: 'cira', tint: '#e3d4ff' },
  { face: 'nils', tint: '#ffe0c2' },
  { face: 'iris', tint: '#c9e9ff' },
  { face: 'huck', tint: '#ffd8e6' },
];

interface PersonAvatarProps {
  seed: number;
  className?: string;
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({
  seed,
  className,
}): JSX.Element => {
  const person = PEOPLE[seed % PEOPLE.length];

  return (
    <span
      className={cn(
        'relative block h-10 w-10 shrink-0 overflow-hidden rounded-[32%]',
        className
      )}
      style={{ backgroundColor: person.tint }}
    >
      <Image
        src={`/illustrations/peeps/avatar/${person.face}.svg`}
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
