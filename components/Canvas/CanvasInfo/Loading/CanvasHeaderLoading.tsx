import React from 'react';

const CanvasHeaderLoading: React.FC = (): JSX.Element => {
  return (
    <div className='absolute top-2 left-2 flex h-12 w-[300px] animate-pulse items-center rounded-md bg-white px-2 shadow-md' />
  );
};
export default CanvasHeaderLoading;
