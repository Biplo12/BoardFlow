'use client';

import React from 'react';

import CanvasFloatingBar from '@/components/Canvas/CanvasInfo/CanvasFloatingBar';
import CanvasParticipants from '@/components/Canvas/CanvasInfo/CanvasParticipants';
import CanvasToolbar from '@/components/Canvas/CanvasToolbar';

import { useSelf } from '@/liveblocks.config';

interface CanvasProps {
  boardId: string;
}

const Canvas: React.FC<CanvasProps> = ({ boardId }): JSX.Element => {
  const { name, picture } = useSelf((self) => self.info);
  return (
    <main className='relative h-full w-full bg-neutral-100'>
      <CanvasFloatingBar boardId={boardId} />
      <CanvasParticipants />
      <CanvasToolbar />
    </main>
  );
};
export default Canvas;
