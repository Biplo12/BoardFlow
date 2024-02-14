'use client';

import { useOrganizationList } from '@clerk/nextjs';
import React from 'react';

import OrgItem from '@/components/Layout/Dashboard/Sidebar/Partials/OrgItem';

const OrgsList: React.FC = (): JSX.Element | null => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships.data?.length) return null;

  return (
    <ul className='flex flex-col gap-2'>
      {userMemberships.data?.map((membership) => {
        return (
          <OrgItem
            key={membership.organization.id}
            id={membership.organization.id}
            name={membership.organization.name}
            imageUrl={membership.organization.imageUrl}
          />
        );
      })}
    </ul>
  );
};
export default OrgsList;
