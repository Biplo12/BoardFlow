import React from 'react';

const CanvasFloatingBarLoading: React.FC = (): JSX.Element => {
  return (
    <div className='absolute left-2 top-2 flex h-12 w-[300px] animate-pulse items-center rounded-md bg-white px-2 shadow-md' />
  );
};
export default CanvasFloatingBarLoading;
