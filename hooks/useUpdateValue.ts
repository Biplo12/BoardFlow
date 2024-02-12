import { useMutation } from '@/liveblocks.config';

const useUpdateValue = () => {
  const updateValue = useMutation(
    ({ storage }, newValue: string, id: string) => {
      const liveLayers = storage.get('layers');
      liveLayers.get(id)?.set('value', newValue);
    },
    []
  );

  return { updateValue };
};

export default useUpdateValue;
