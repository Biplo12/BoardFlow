/* eslint-disable @next/next/no-img-element */
import React from 'react';

import { shapeStyle } from '@/lib/canvas-style';

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
  const { x, y, width, height, value } = layer;
  const style = shapeStyle(layer);

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      opacity={style.opacity}
    >
      {/* An image takes the frame and the corner setting from the panel, so
          the controls are not dead on it. */}
      <img
        src={value || PLACEHOLDER_IMAGE}
        alt='image'
        className='h-full w-full object-cover'
        style={{
          borderRadius: style.radius,
          border: `${style.strokeWidth}px solid ${style.stroke}`,
        }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = IMAGE_NOT_FOUND;
        }}
      />
    </foreignObject>
  );
};
export default ImageObject;
