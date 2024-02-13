import Image from 'next/image';
import React from 'react';

const EmptyFavorites: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-6 text-center'>
      <Image
        src={`/images/board/no-favorites-desktop.svg`}
        alt='No Favorites'
        width={300}
        height={300}
        className='hidden sm:block'
      />
      <Image
        src={`/images/board/no-favorites-mobile.svg`}
        alt='No Favorites'
        width={175}
        height={175}
        className='block sm:hidden'
      />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>No favorites found!</h1>
        <p className='text-sm text-muted-foreground'>
          Add boards to your favorites to see them here.
        </p>
      </div>
    </div>
  );
};
export default EmptyFavorites;
