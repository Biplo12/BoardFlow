'use client';

import React from 'react';

import Peep from '@/components/common/Peep';
import CreateOrganizationDialog from '@/components/Layout/Dashboard/Organizations/CreateOrganizationDialog';

const NoOrganization: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 text-center'>
      <Peep figure='hands-on-hips' className='h-[230px]' />
      <h1
        className='candy-display text-[32px]'
        style={{ color: 'var(--candy-ink)' }}
      >
        Start an organization
      </h1>
      <p
        className='max-w-[360px] text-[16px] font-medium'
        style={{ color: 'var(--candy-muted)' }}
      >
        Boards live inside an organization. Make one, then invite the people
        you work with.
      </p>

      <CreateOrganizationDialog>
        <button
          className='candy-button mt-2 flex h-14 items-center rounded-[22px] px-8 text-[17px] font-semibold text-white'
          style={{ backgroundColor: 'var(--candy-pink)' }}
        >
          Create an organization
        </button>
      </CreateOrganizationDialog>
    </div>
  );
};
export default NoOrganization;
