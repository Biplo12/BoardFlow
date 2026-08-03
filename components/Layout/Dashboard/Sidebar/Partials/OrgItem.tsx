'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationList } from '@/hooks/useOrganizationList';

import Hint from '@/components/common/Hint';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Id } from '@/convex/_generated/dataModel';

interface OrgItemProps {
  id: Id<'organizations'>;
  name: string;
  imageUrl?: string;
}

const getInitials = (name: string) =>
  name.trim().slice(0, 2).toUpperCase() || 'OR';

const OrgItem: React.FC<OrgItemProps> = ({
  id,
  name,
  imageUrl,
}): JSX.Element => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?._id === id;

  return (
    <div className='relative aspect-square'>
      <Hint label={name} side='right' align='start' sideOffset={18}>
        <button onClick={() => setActive(id)} className='h-full w-full'>
          <Avatar
            className={cn(
              'h-full w-full cursor-pointer rounded-md opacity-75 transition hover:opacity-100',
              isActive && 'opacity-100 ring-2 ring-white'
            )}
          >
            {imageUrl && <AvatarImage src={imageUrl} />}
            <AvatarFallback className='rounded-md text-sm font-semibold'>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </Hint>
    </div>
  );
};
export default OrgItem;
