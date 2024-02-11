/* eslint-disable unused-imports/no-unused-vars */
import React, { memo } from 'react';

import Ellipse from '@/components/Canvas/CanvasObjects/Objects/Ellipse';
import Rectangle from '@/components/Canvas/CanvasObjects/Objects/Rectangle';

import { useStorage } from '@/liveblocks.config';

import { LayerType } from '@/types/TCanvasState';

interface LayerPreviewProps {
  layerId: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const LayerPreview: React.FC<LayerPreviewProps> = memo(
  ({ layerId, onLayerPointerDown, selectionColor }) => {
    const layer = useStorage((root) => root.layers.get(layerId));

    if (!layer) {
      return null;
    }

    switch (layer.type) {
      case LayerType.Rectangle:
        return (
          <Rectangle
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      default:
        console.warn('Unknown layer type');
        return null;
    }
  }
);

LayerPreview.displayName = 'LayerPreview';

export default LayerPreview;
