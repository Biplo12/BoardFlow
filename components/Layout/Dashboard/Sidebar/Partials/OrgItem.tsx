'use client';

import React from 'react';

import { orgTint } from '@/lib/utils';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationList } from '@/hooks/useOrganizationList';

import Hint from '@/components/common/Hint';

import { Id } from '@/convex/_generated/dataModel';

const getInitials = (name: string) =>
  name.trim().slice(0, 2).toUpperCase() || 'OR';

interface OrgItemProps {
  id: Id<'organizations'>;
  name: string;
}

const OrgItem: React.FC<OrgItemProps> = ({ id, name }): JSX.Element => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?._id === id;
  const tint = orgTint(id);

  return (
    <div className='relative aspect-square'>
      <Hint label={name} side='right' align='start' sideOffset={18}>
        <button
          onClick={() => setActive(id)}
          data-active={isActive}
          className='org-chip'
          style={{ backgroundColor: tint.background, color: tint.ink }}
        >
          {getInitials(name)}
        </button>
      </Hint>
    </div>
  );
};
export default OrgItem;
