import { OrganizationProfile } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const InviteButton: React.FC = (): JSX.Element => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[900px] border-none bg-transparent p-0'>
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
export default InviteButton;
