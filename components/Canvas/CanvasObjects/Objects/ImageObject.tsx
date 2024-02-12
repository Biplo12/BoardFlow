/* eslint-disable @next/next/no-img-element */
/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { ImageLayer } from '@/types/TCanvasState';

const PLACEHOLDER_IMAGE = '/images/board/placeholders/placeholder-image.jpeg';
const IMAGE_NOT_FOUND = '/images/board/placeholders/image-not-found.png';

interface ImageObjectProps {
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

const ImageObject: React.FC<ImageObjectProps> = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}): JSX.Element => {
  const { x, y, width, height, value } = layer;
  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
      }}
    >
      {' '}
      <img
        src={value || PLACEHOLDER_IMAGE}
        alt='image'
        className='h-full w-full'
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = IMAGE_NOT_FOUND;
        }}
      />
    </foreignObject>
  );
};
export default ImageObject;
