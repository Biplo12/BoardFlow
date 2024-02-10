'use client';

import React from 'react';

import CanvasFloatingBar from '@/components/Canvas/CanvasInfo/CanvasFloatingBar';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';

const Canvas: React.FC = (): JSX.Element => {
  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasFloatingBar />
      <CanvasParticipants />
    </main>
  );
};
export default Canvas;
