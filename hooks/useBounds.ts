import { shallow } from '@liveblocks/react';

import { resizeBox } from '@/lib/canvas-resize';

import { useSelf, useStorage } from '@/liveblocks.config';

import { Layer, XYWH } from '@/types/TCanvasState';

const isMeasurable = (layer: Layer) =>
  Number.isFinite(layer.x) &&
  Number.isFinite(layer.y) &&
  Number.isFinite(layer.width) &&
  Number.isFinite(layer.height);

/* A layer with a broken number would poison the box and reach the DOM as a
   NaN attribute, so it is left out of the measurement entirely. */
const boundingBox = (all: Layer[]): XYWH | null => {
  const layers = all.filter(isMeasurable);
  const first = layers[0];

  if (!first) {
    return null;
  }

  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

const useBounds = () => {
  const selection = useSelf((me) => me.presence.selection);
  const bounds = useStorage((root) => {
    const selectedLayers = selection
      .map((layerId) => root.layers[layerId]!)
      .filter(Boolean);

    return boundingBox(selectedLayers);
  }, shallow);

  return { bounds, resizeBox };
};

export default useBounds;
