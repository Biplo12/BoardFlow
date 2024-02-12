import { useSelf, useStorage } from '@/liveblocks.config';

import { LayerType } from '@/types/TCanvasState';

const useIsObjectSelected = (objectSelected: LayerType) => {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );
  const isObjectSelected = useStorage(
    (root) =>
      soleLayerId && root.layers.get(soleLayerId)?.type === objectSelected
  );

  const isObjectSelectedBoolean = isObjectSelected ? true : false;

  return isObjectSelectedBoolean;
};

export default useIsObjectSelected;
