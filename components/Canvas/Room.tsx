'use client';
import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';
import React from 'react';

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from '@/liveblocks.config';

import { Layer } from '@/types/TCanvasState';

interface RoomProps {
  children: React.ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
}

const Room: React.FC<RoomProps> = ({ children, roomId, fallback }) => {
  return (
    <LiveblocksProvider authEndpoint='/api/liveblocks-auth' throttle={16}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
          pencilDraft: null,
          penColor: null,
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layerIds: new LiveList<string>([]),
        }}
      >
        <ClientSideSuspense fallback={fallback}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
export default Room;
