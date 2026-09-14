'use client';

import React from 'react';

import { useOrganizationList } from '@/hooks/useOrganizationList';

import OrgItem from '@/components/Layout/Dashboard/Sidebar/Partials/OrgItem';

const OrgsList: React.FC = (): JSX.Element | null => {
  const { organizations } = useOrganizationList();

  if (!organizations.length) return null;

  return (
    <ul className='flex flex-col gap-2'>
      {organizations.map((organization) => (
        <OrgItem
          key={organization._id}
          id={organization._id}
          name={organization.name}
        />
      ))}
    </ul>
  );
};
export default OrgsList;
