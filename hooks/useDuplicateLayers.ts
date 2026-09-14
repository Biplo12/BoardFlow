import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';

import { useMutation } from '@/liveblocks.config';

import { Layer } from '@/types/TCanvasState';

const OFFSET = 24;

const useDuplicateLayers = () => {
  const duplicate = useMutation(
    ({ storage, self, setMyPresence }, offset: number) => {
      /* Read from presence, not from the render that created this callback:
         alt-drag selects the layer under the pointer and duplicates it in the
         same tick, and the closure would still hold the previous selection. */
      const selection = self.presence.selection;

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
    []
  );

  /* Both are event handlers, so neither takes an argument: a click event
     landing in a positional parameter would be written straight into the
     coordinates of every copy. */
  const duplicateLayers = useCallback(() => duplicate(OFFSET), [duplicate]);
  const duplicateInPlace = useCallback(() => duplicate(0), [duplicate]);

  return { duplicateLayers, duplicateInPlace };
};

export default useDuplicateLayers;
