import { useMutation } from '@/liveblocks.config';

const useUpdateValue = () => {
  const updateValue = useMutation(
    ({ storage }, newValue: string, id: string) => {
      const liveLayers = storage.get('layers');
      liveLayers.get(id)?.set('value', newValue);
    },
    []
  );

  /* Text that was never typed leaves nothing on the board to click on, so it
     goes away again the moment it loses focus. */
  const discardIfEmpty = useMutation(
    ({ storage, self, setMyPresence }, id: string) => {
      const liveLayers = storage.get('layers');
      const layer = liveLayers.get(id);

      if (!layer || layer.get('value')) return;

      liveLayers.delete(id);

      const liveLayerIds = storage.get('layerIds');
      const index = liveLayerIds.indexOf(id);

      if (index !== -1) liveLayerIds.delete(index);

      const selection = self.presence.selection;

      if (selection.includes(id)) {
        setMyPresence({ selection: selection.filter((other) => other !== id) });
      }
    },
    []
  );

  return { updateValue, discardIfEmpty };
};

export default useUpdateValue;
