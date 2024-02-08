import Image from 'next/image';
import React from 'react';

const EmptyFavorites: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-6 text-center'>
      <Image
        src='/images/board/no-favorites.svg'
        height={300}
        width={300}
        alt='Empty'
      />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>No favorites found!</h1>
        <p className='text-muted-foreground text-sm'>
          Add boards to your favorites to see them here.
        </p>
      </div>
    </div>
  );
};
export default EmptyFavorites;
