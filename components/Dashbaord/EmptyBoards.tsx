'use client';

import { useOrganization } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import { Button } from '@/components/ui/button';

import { api } from '@/convex/_generated/api';

const EmptyBoards: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);

  const handleCreateBoard = async () => {
    if (!organization) return;
    try {
      const boardId = await mutate({
        orgId: organization.id,
        title: 'New Board',
      });
      toast.success('Board created successfully');
      router.push(`/board/${boardId}`);
    } catch (error) {
      toast.error('Failed to create board');
      console.error(error);
    }
  };

  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-6 text-center'>
      <Image
        src={`/images/board/no-board-desktop.svg`}
        alt='No Board'
        width={300}
        height={300}
        className='hidden sm:block'
      />
      <Image
        src={`/images/board/no-board-mobile.svg`}
        alt='No Board'
        width={100}
        height={100}
        className='block sm:hidden'
      />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Create your first board!</h1>
        <p className='text-sm text-muted-foreground'>
          Create a board by clicking the button below.
        </p>
      </div>
      <Button size='lg' onClick={handleCreateBoard} disabled={pending}>
        Create board
      </Button>
    </div>
  );
};
export default EmptyBoards;
