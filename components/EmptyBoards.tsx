import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';

const EmptyBoards: React.FC = (): JSX.Element => {
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
        <p className='text-muted-foreground text-sm'>
          Create a board by clicking the button below.
        </p>
      </div>
      <Button size='lg'>Create board</Button>
    </div>
  );
};
export default EmptyBoards;
