'use client';

import React from 'react';

import Canvas from '@/components/Canvas/Canvas';
import CanvasLoading from '@/components/Canvas/Partials/CanvasLoading';
import Room from '@/components/Canvas/Room';

interface BoardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function BoardPage({ params }: BoardPageProps): JSX.Element {
  const { boardId } = React.use(params);

  return (
    <div className='flex h-full w-full'>
      <Room roomId={boardId} fallback={<CanvasLoading />}>
        <Canvas boardId={boardId} />
      </Room>
    </div>
  );
}
