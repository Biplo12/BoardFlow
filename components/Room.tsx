'use client';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import { ClientSideSuspense } from '@liveblocks/react';
import React from 'react';

import { RoomProvider } from '@/liveblocks.config';

import { Layer } from '@/types/TCanvasState';

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

const Room: React.FC<RoomProps> = ({ children, roomId, fallback }) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, selection: [] }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList<string>(),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
export default Room;
