/* eslint-disable unused-imports/no-unused-vars */
import React, { memo } from 'react';

import { colorToCss } from '@/lib/utils';

import Ellipse from '@/components/Canvas/CanvasObjects/Objects/Ellipse';
import Note from '@/components/Canvas/CanvasObjects/Objects/Note';
import Path from '@/components/Canvas/CanvasObjects/Objects/Path';
import Rectangle from '@/components/Canvas/CanvasObjects/Objects/Rectangle';
import Text from '@/components/Canvas/CanvasObjects/Objects/Text';

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
      case LayerType.Text:
        return (
          <Text
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Path:
        return (
          <Path
            key={layerId}
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, layerId)}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : '#000'}
            stroke={selectionColor}
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
