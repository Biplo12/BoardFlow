import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

import Hint from '@/components/common/Hint';

interface OrgItemProps {
  id: string;
  name: string;
  imageUrl: string;
}

const OrgItem: React.FC<OrgItemProps> = ({
  id,
  name,
  imageUrl,
}): JSX.Element => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const handleClickOrg = () => {
    if (!setActive) return;
    setActive({ organization: id });
  };
  return (
    <div className='relative aspect-square'>
      <Hint label={name} side='right' align='start' sideOffset={18}>
        <Image
          src={imageUrl}
          alt={name}
          layout='fill'
          fill
          className={cn(
            'cursor-pointer rounded-md opacity-75 transition hover:opacity-100',
            isActive && 'opacity-100'
          )}
          onClick={handleClickOrg}
        />
      </Hint>
    </div>
  );
};
export default OrgItem;
