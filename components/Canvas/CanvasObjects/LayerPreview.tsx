import React, { memo } from 'react';

import { colorToCss } from '@/lib/utils';

import Arrow from '@/components/Canvas/CanvasObjects/Objects/Arrow';
import Diamond from '@/components/Canvas/CanvasObjects/Objects/Diamond';
import Ellipse from '@/components/Canvas/CanvasObjects/Objects/Ellipse';
import ImageObject from '@/components/Canvas/CanvasObjects/Objects/ImageObject';
import Line from '@/components/Canvas/CanvasObjects/Objects/Line';
import Note from '@/components/Canvas/CanvasObjects/Objects/Note';
import Path from '@/components/Canvas/CanvasObjects/Objects/Path';
import Rectangle from '@/components/Canvas/CanvasObjects/Objects/Rectangle';
import Text from '@/components/Canvas/CanvasObjects/Objects/Text';

import { useStorage } from '@/liveblocks.config';

import { LayerType } from '@/types/TCanvasState';

interface LayerPreviewProps {
  layerId: string;
  isEditing: boolean;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  onEdit: (layerId: string) => void;
  onStopEditing: () => void;
}

const LayerPreview: React.FC<LayerPreviewProps> = memo(
  ({ layerId, isEditing, onLayerPointerDown, onEdit, onStopEditing }) => {
    const layer = useStorage((root) => root.layers[layerId]);

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
          />
        );
      case LayerType.Diamond:
        return (
          <Diamond
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
          />
        );
      case LayerType.Arrow:
        return (
          <Arrow id={layerId} layer={layer} onPointerDown={onLayerPointerDown} />
        );
      case LayerType.Line:
        return (
          <Line id={layerId} layer={layer} onPointerDown={onLayerPointerDown} />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
          />
        );
      case LayerType.Text:
        return (
          <Text
            id={layerId}
            layer={layer}
            isEditing={isEditing}
            onPointerDown={onLayerPointerDown}
            onEdit={onEdit}
            onStopEditing={onStopEditing}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={layerId}
            layer={layer}
            isEditing={isEditing}
            onPointerDown={onLayerPointerDown}
            onEdit={onEdit}
            onStopEditing={onStopEditing}
          />
        );
      case LayerType.Path:
        return (
          <Path
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, layerId)}
            x={layer.x}
            y={layer.y}
            fill={colorToCss(layer.stroke ?? layer.fill)}
            strokeWidth={layer.strokeWidth}
            opacity={(layer.opacity ?? 100) / 100}
          />
        );
      case LayerType.Image:
        return (
          <ImageObject
            id={layerId}
            layer={layer}
            onPointerDown={onLayerPointerDown}
          />
        );
      default:
        return null;
    }
  }
);

LayerPreview.displayName = 'LayerPreview';

export default LayerPreview;
