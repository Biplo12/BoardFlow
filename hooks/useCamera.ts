import { useCallback, useState } from 'react';

import { Camera } from '@/types/TCanvasState';

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const STEP = 1.2;

const LINE_HEIGHT = 16;

const clamp = (scale: number) =>
  Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));

/* Firefox reports wheel deltas in lines and pages, not pixels. */
const toPixels = (delta: number, mode: number) => {
  if (mode === 1) return delta * LINE_HEIGHT;
  if (mode === 2) return delta * window.innerHeight;
  return delta;
};

const useCamera = () => {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 });

  /* Zoom keeps the point under the pointer still: convert it to world space
     with the old scale, then move the camera so it lands there again. */
  const zoomAt = useCallback(
    (nextScale: number, screenX: number, screenY: number) => {
      setCamera((current) => {
        const scale = clamp(nextScale);
        const worldX = (screenX - current.x) / current.scale;
        const worldY = (screenY - current.y) / current.scale;

        return {
          scale,
          x: screenX - worldX * scale,
          y: screenY - worldY * scale,
        };
      });
    },
    []
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const direction = e.deltaY < 0 ? STEP : 1 / STEP;
        setCamera((current) => {
          const scale = clamp(current.scale * direction);
          const worldX = (e.clientX - current.x) / current.scale;
          const worldY = (e.clientY - current.y) / current.scale;

          return {
            scale,
            x: e.clientX - worldX * scale,
            y: e.clientY - worldY * scale,
          };
        });
        return;
      }

      const dx = toPixels(e.deltaX, e.deltaMode);
      const dy = toPixels(e.deltaY, e.deltaMode);

      /* Shift turns the wheel sideways. Some browsers already report that as
         deltaX, others leave it on deltaY, so take whichever moved. */
      if (e.shiftKey) {
        const sideways = dx || dy;

        setCamera((current) => ({ ...current, x: current.x - sideways }));
        return;
      }

      setCamera((current) => ({
        ...current,
        x: current.x - dx,
        y: current.y - dy,
      }));
    },
    []
  );

  const zoomIn = useCallback(() => {
    zoomAt(camera.scale * STEP, window.innerWidth / 2, window.innerHeight / 2);
  }, [camera.scale, zoomAt]);

  const zoomOut = useCallback(() => {
    zoomAt(camera.scale / STEP, window.innerWidth / 2, window.innerHeight / 2);
  }, [camera.scale, zoomAt]);

  const resetZoom = useCallback(() => {
    setCamera({ x: 0, y: 0, scale: 1 });
  }, []);

  const panBy = useCallback((dx: number, dy: number) => {
    setCamera((current) => ({
      ...current,
      x: current.x + dx,
      y: current.y + dy,
    }));
  }, []);

  return { camera, onWheel, zoomIn, zoomOut, resetZoom, panBy };
};

export default useCamera;
