import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';

import { Color, Layer } from '@/types/TCanvasState';

type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[];
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
};

type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

type UserMeta = {
  id?: string;
  info: {
    name: string;
    picture: string;
  };
};

declare global {
  interface Liveblocks {
    Presence: Presence;
    Storage: Storage;
    UserMeta: UserMeta;
  }
}

export {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useMyPresence,
  useOther,
  useOthers,
  useOthersConnectionIds,
  useOthersMapped,
  useRedo,
  useRoom,
  useSelf,
  useStatus,
  useStorage,
  useUndo,
  useUpdateMyPresence,
} from '@liveblocks/react/suspense';
