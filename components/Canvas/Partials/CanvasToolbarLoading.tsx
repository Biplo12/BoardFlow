import React from 'react';

const CanvasToolbarLoading: React.FC = (): JSX.Element => {
  return (
    <div className='absolute top-[50%] left-2 flex h-[360px] w-[50px] -translate-y-[50%] animate-pulse flex-col gap-4 rounded-md bg-white shadow-md' />
  );
};
export default CanvasToolbarLoading;
