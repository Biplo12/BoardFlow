import React from 'react';

import NewButton from '@/components/Layout/Sidebar/Partials/NewButton';
import OrgsList from '@/components/Layout/Sidebar/Partials/OrganizationsList';

const Sidebar: React.FC = (): JSX.Element => {
  return (
    <aside className='fixed left-0 z-10 flex h-full w-16 flex-col gap-4 bg-blue-950 p-3 text-white'>
      <OrgsList />
      <NewButton />
    </aside>
  );
};
export default Sidebar;
