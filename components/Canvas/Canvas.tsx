'use client';

import React from 'react';

import CanvasFloatingBar from '@/components/Canvas/CanvasInfo/CanvasFloatingBar';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar';

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = (): JSX.Element => {
  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasFloatingBar />
      <CanvasParticipants />
      <CanvasToolbar />
    </main>
  );
};
export default Canvas;
