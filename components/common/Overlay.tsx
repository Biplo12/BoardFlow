import React from 'react';

const BoardOverlay: React.FC = (): JSX.Element => {
  return (
    <div className='h-full w-full bg-black opacity-0 transition-opacity group-hover:opacity-25' />
  );
};
export default BoardOverlay;
