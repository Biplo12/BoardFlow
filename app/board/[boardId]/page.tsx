'use client';

import Canvas from '@/components/Canvas/Canvas';
import CanvasLoading from '@/components/Canvas/Partials/CanvasLoading';
import Room from '@/components/Canvas/Room';

interface BoardPageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: BoardPageProps): JSX.Element {
  return (
    <div className='flex h-full w-full'>
      <Room roomId={params.boardId} fallback={<CanvasLoading />}>
        <Canvas boardId={params.boardId} />
      </Room>
    </div>
  );
}
