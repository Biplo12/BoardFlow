import React from 'react';

const CanvasToolbar: React.FC = (): JSX.Element => {
  return (
    <div className='absolute left-2 top-[50%] flex -translate-y-[50%] flex-col gap-4'>
      <div className='flex flex-col items-center gap-1 rounded-md bg-white p-2 shadow-md'>
        <div className=''>Pencil</div>
        <div className=''>Eraser</div>
        <div className=''>Text</div>
        <div className=''>Shapes</div>
      </div>
      <div className='flex flex-col items-center rounded-md bg-white p-2 shadow-md'>
        <div className=''>Undo</div>
        <div className=''>Redo</div>
      </div>
    </div>
  );
};
export default CanvasToolbar;
