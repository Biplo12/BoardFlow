import React from 'react';

const CanvasFloatingBar: React.FC = (): JSX.Element => {
  return (
    <div className='absolute left-2 top-2 flex h-12 items-center rounded-md bg-white px-2 shadow-sm'>
      Information about the canvas
    </div>
  );
};
export default CanvasFloatingBar;
