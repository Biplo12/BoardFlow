import React from 'react';

import BrandMark from '@/components/common/BrandMark';

const Loading: React.FC = (): JSX.Element => {
  return (
    <div className='bg-background flex h-full w-full items-center justify-center'>
      <BrandMark className='text-foreground h-14 w-14 animate-pulse duration-1000 ease-in-out' />
    </div>
  );
};
export default Loading;
