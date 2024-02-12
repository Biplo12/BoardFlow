import { useSelf, useStorage } from '@/liveblocks.config';

const useSelectedLayerInfo = () => {
  const selection = useSelf((me) => me.presence.selection);

  const layer = useStorage((root) => root.layers.get(selection[0]));
  return { layer, selection };
};

export default useSelectedLayerInfo;
