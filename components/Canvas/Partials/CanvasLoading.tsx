import { Loader } from 'lucide-react';
import React from 'react';

import CanvasFloatingBarLoading from '@/components/Canvas/CanvasInfo/Loading/CanvasFloatingbarLoading';
import CanvasParticipantsLoading from '@/components/Canvas/CanvasInfo/Loading/CanvasParticipantsLoading';
import CanvasToolbarLoading from '@/components/Canvas/Partials/CanvasToolbarLoading';

const CanvasLoading: React.FC = (): JSX.Element => {
  return (
    <main className='relative flex h-full w-full items-center justify-center bg-neutral-100'>
      <Loader className='h-6 w-6 animate-spin text-muted-foreground' />
      <CanvasFloatingBarLoading />
      <CanvasParticipantsLoading />
      <CanvasToolbarLoading />
    </main>
  );
};
export default CanvasLoading;
