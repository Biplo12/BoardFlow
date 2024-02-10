'use client';
import { ClientSideSuspense } from '@liveblocks/react';
import React from 'react';

import { RoomProvider } from '@/liveblocks.config';

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

const Room: React.FC<RoomProps> = ({ children, roomId, fallback }) => {
  return (
    <RoomProvider id={roomId} initialPresence={{}}>
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
export default Room;
