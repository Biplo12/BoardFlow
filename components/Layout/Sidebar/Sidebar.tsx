import React from 'react';

const Sidebar: React.FC = (): JSX.Element => {
  return (
    <aside className='fixed left-0 z-10 flex h-full w-16 flex-col gap-4 bg-blue-950 p-3 text-white'>
      Side
    </aside>
  );
};
export default Sidebar;
