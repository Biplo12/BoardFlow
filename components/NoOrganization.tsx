'use client';

import { CreateOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const NoOrganization: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-6 text-center'>
      <Image
        src={`/images/board/no-org-desktop.svg`}
        alt='No Organization'
        width={300}
        height={300}
        className='hidden sm:block'
      />
      <Image
        src={`/images/board/no-org-mobile.svg`}
        alt='No Organization'
        width={100}
        height={100}
        className='block sm:hidden'
      />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Welcome to the dashboard!</h1>
        <p className='text-muted-foreground text-sm'>
          You can create a new organization or join an existing one using the
          button below.
        </p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='lg'>Create organization</Button>
        </DialogTrigger>
        <DialogContent className='max-w-[480px] border-none bg-transparent p-0'>
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default NoOrganization;
