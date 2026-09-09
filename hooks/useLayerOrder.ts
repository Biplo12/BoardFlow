import { useCallback } from 'react';

import { OrderDirection, orderMoves } from '@/lib/canvas-order';

import { useMutation, useSelf } from '@/liveblocks.config';

const useLayerOrder = () => {
  const selection = useSelf((me) => me.presence.selection);

  const reorder = useMutation(
    ({ storage }, direction: OrderDirection) => {
      if (!selection?.length) return;

      const liveLayerIds = storage.get('layerIds');
      const moves = orderMoves(liveLayerIds.toJSON(), selection, direction);

      for (const { from, to } of moves) {
        liveLayerIds.move(from, to);
      }
    },
    [selection]
  );

  const sendToBack = useCallback(() => reorder('back'), [reorder]);
  const sendBackward = useCallback(() => reorder('backward'), [reorder]);
  const bringForward = useCallback(() => reorder('forward'), [reorder]);
  const bringToFront = useCallback(() => reorder('front'), [reorder]);

  return { sendToBack, sendBackward, bringForward, bringToFront };
};

export default useLayerOrder;
