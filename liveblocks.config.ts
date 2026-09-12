import { LiveList, LiveMap, LiveObject } from '@liveblocks/client';

import { CanvasStyle } from '@/constant/canvas';

import { Color, Layer, LayerType, Point } from '@/types/TCanvasState';

type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[];
  pencilDraft: [x: number, y: number, pressure: number][] | null;
  penColor: Color | null;
  penWidth: number | null;
  penOpacity: number | null;
  /* The shape currently being dragged out, so the rest of the room sees it
     take shape instead of having it appear on release. */
  draft: {
    layerType: LayerType;
    origin: Point;
    current: Point;
    style: CanvasStyle;
  } | null;
};

type Storage = {
  layers: LiveMap<string, LiveObject<Layer>>;
  layerIds: LiveList<string>;
};

type UserMeta = {
  id?: string;
  info: {
    userId: string;
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
