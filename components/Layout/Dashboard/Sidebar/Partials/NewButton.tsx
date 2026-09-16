'use client';

import { Plus } from 'lucide-react';
import React from 'react';

import Hint from '@/components/common/Hint';
import CreateOrganizationDialog from '@/components/Layout/Dashboard/Organizations/CreateOrganizationDialog';

const NewButton: React.FC = (): JSX.Element => {
  return (
    <CreateOrganizationDialog>
      <div className='aspect-square'>
        <Hint
          label='Create organization'
          side='right'
          align='start'
          sideOffset={18}
        >
          <button className='flex h-full w-full items-center justify-center rounded-[14px] border-2 border-dashed border-white/45 text-white/70 transition hover:border-white hover:text-white'>
            <Plus />
          </button>
        </Hint>
      </div>
    </CreateOrganizationDialog>
  );
};
export default NewButton;
