import { LiveObject } from '@liveblocks/client';

import { AlignItem, Alignment, alignmentAxis, alignPositions } from '@/lib/canvas-align';

import { useMutation, useSelf } from '@/liveblocks.config';

import { Layer } from '@/types/TCanvasState';

export type { Alignment };

const useAlignLayers = () => {
  const selection = useSelf((me) => me.presence.selection);

  const alignLayers = useMutation(
    ({ storage }, alignment: Alignment) => {
      if (selection.length < 2) return;

      const liveLayers = storage.get('layers');

      const entries = selection
        .map((id) => [id, liveLayers.get(id)] as const)
        .filter((entry): entry is [string, LiveObject<Layer>] => !!entry[1]);

      if (entries.length < 2) return;

      const items: AlignItem[] = entries.map(([id, layer]) => ({
        id,
        x: layer.get('x'),
        y: layer.get('y'),
        width: layer.get('width'),
        height: layer.get('height'),
      }));

      const axis = alignmentAxis(alignment);
      const moves = alignPositions(items, alignment);

      for (const [id, layer] of entries) {
        const next = moves[id];
        if (next !== undefined) layer.set(axis, next);
      }
    },
    [selection]
  );

  return alignLayers;
};

export default useAlignLayers;
