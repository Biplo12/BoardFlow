import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';

import { useMutation, useSelf } from '@/liveblocks.config';

import { Layer } from '@/types/TCanvasState';

const OFFSET = 24;

const useDuplicateLayers = () => {
  const selection = useSelf((me) => me.presence.selection);

  const duplicateLayers = useMutation(
    ({ storage, setMyPresence }, offset: number = OFFSET) => {
      if (!selection?.length) return;

      const liveLayers = storage.get('layers');
      const liveLayerIds = storage.get('layerIds');
      const copies: string[] = [];

      for (const id of selection) {
        const layer = liveLayers.get(id);
        if (!layer) continue;

        const copyId = nanoid();
        const copy = layer.clone() as LiveObject<Layer>;

        copy.update({
          x: layer.get('x') + offset,
          y: layer.get('y') + offset,
        });

        liveLayerIds.push(copyId);
        liveLayers.set(copyId, copy);
        copies.push(copyId);
      }

      setMyPresence({ selection: copies }, { addToHistory: true });
    },
    [selection]
  );

  return duplicateLayers;
};

export default useDuplicateLayers;
