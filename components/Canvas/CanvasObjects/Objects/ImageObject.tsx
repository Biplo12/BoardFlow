/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { ImageLayer } from '@/types/TCanvasState';

const PLACEHOLDER_IMAGE = '/images/board/placeholders/placeholder-image.jpeg';
const IMAGE_NOT_FOUND = '/images/board/placeholders/image-not-found.png';

interface ImageObjectProps {
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
}

const ImageObject: React.FC<ImageObjectProps> = ({
  id,
  layer,
  onPointerDown,
}): JSX.Element => {
  const { x, y, width, height, opacity, value } = layer;

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      opacity={(opacity ?? 100) / 100}
    >
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
