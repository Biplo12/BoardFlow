import { useCallback, useState } from 'react';

import { Camera } from '@/types/TCanvasState';

const useCamera = () => {
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });

  // on x and y coordinates it should have in mind zoom scale
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  return {
    camera,
    onWheel,
  };
};

export default useCamera;
