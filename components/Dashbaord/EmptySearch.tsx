import Image from 'next/image';
import React from 'react';

const EmptySearch: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-6 text-center'>
      <Image
        src='/images/board/search-bar.svg'
        height={225}
        width={225}
        alt='Empty'
      />
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>No boards found!</h1>
        <p className='text-muted-foreground text-sm'>
          Try a different search term.
        </p>
      </div>
    </div>
  );
};
export default EmptySearch;
