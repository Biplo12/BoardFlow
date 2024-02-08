import { CreateOrganization } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import React from 'react';

import Hint from '@/components/common/Hint';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const NewButton: React.FC = (): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='aspect-square'>
          <Hint
            label='Create organization'
            side='right'
            align='start'
            sideOffset={18}
          >
            <button className='flex h-full w-full items-center justify-center rounded-md bg-white/25 opacity-60 transition hover:opacity-100'>
              <Plus />
            </button>
          </Hint>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[480px] border-none bg-transparent p-0'>
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
export default NewButton;
