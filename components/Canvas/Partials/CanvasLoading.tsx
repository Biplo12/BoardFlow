import Image from 'next/image';
import React from 'react';

const CanvasLoading: React.FC = (): JSX.Element => {
  return (
    <main className='relative flex h-full w-full flex-col items-center justify-center gap-2 bg-white'>
      <Image
        src='/images/logo/logo-white-name.png'
        alt='Logo'
        width={75}
        height={75}
        className='animate-pulse duration-1000 ease-in-out'
      />
    </main>
  );
};
export default CanvasLoading;
