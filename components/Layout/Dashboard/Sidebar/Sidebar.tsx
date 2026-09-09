import React from 'react';

import NewButton from '@/components/Layout/Dashboard/Sidebar/Partials/NewButton';
import OrgsList from '@/components/Layout/Dashboard/Sidebar/Partials/OrganizationsList';

const Sidebar: React.FC = (): JSX.Element => {
  return (
    <aside
      className='fixed left-0 z-20 flex h-full w-16 flex-col gap-4 p-3 text-white'
      style={{ backgroundColor: 'var(--candy-ink)' }}
    >
      <OrgsList />
      <NewButton />
    </aside>
  );
};
export default Sidebar;
