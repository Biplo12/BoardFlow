 
import React, { useEffect, useRef } from 'react';

import { colorToCss } from '@/lib/utils';
import useCanvas from '@/hooks/useCanvas';

import InsertPreview from '@/components/Canvas/CanvasObjects/InsertPreview';
import LayerPreview from '@/components/Canvas/CanvasObjects/LayerPreview';
import Path from '@/components/Canvas/CanvasObjects/Objects/Path';
import RemoteSelection from '@/components/Canvas/CanvasObjects/RemoteSelection';
import SelectionBox from '@/components/Canvas/CanvasObjects/SelectionBox';
import CursorsPresence from '@/components/Canvas/CursorsPresence/CursorsPresence';

import { useSelf } from '@/liveblocks.config';

import { CanvasMode, TCanvasState } from '@/types/TCanvasState';

interface CanvasObjectsProps {
  canvasState: TCanvasState;
  canvasActions: ReturnType<typeof useCanvas>;
}

const CanvasObjects: React.FC<CanvasObjectsProps> = ({
  canvasState,
  canvasActions,
}): JSX.Element => {
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const {
    camera,
    layerIds,
    layerIdsToColorSelection,
    lastUsedColor,
    onPointerMove,
    onWheel,
    onPointerLeave,
    onPointerUp,
    onPointerCancel,
    onPointerDown,
    onLayerPointerDown,
    onResizeHandlePointerDown,
    style,
  } = canvasActions;

  const surfaceRef = useRef<SVGSVGElement>(null);

  /* React attaches wheel passively, so a pinch would zoom the canvas and the
     browser page at once. A non-passive listener lets us claim the gesture. */
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      onWheel(event as unknown as React.WheelEvent);
    };

    surface.addEventListener('wheel', handleWheel, { passive: false });

    return () => surface.removeEventListener('wheel', handleWheel);
  }, [onWheel]);

  const cursor =
    canvasState.mode === CanvasMode.Panning ||
    canvasState.mode === CanvasMode.Translating
      ? 'grabbing'
      : canvasState.mode === CanvasMode.Hand
        ? 'grab'
        : canvasState.mode === CanvasMode.Inserting ||
            canvasState.mode === CanvasMode.Pencil
          ? 'crosshair'
          : canvasState.mode === CanvasMode.Erasing
            ? 'cell'
            : 'default';

  return (
    <svg
      ref={surfaceRef}
      className='h-[100vh] w-[100vw] select-none'
      style={{
        cursor,
        touchAction: 'none',
        overscrollBehavior: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      <g
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
        }}
      >
        {layerIds.map((layerId) => (
          <LayerPreview
            key={layerId}
            layerId={layerId}
            onLayerPointerDown={onLayerPointerDown}
          />
        ))}
        {Object.entries(layerIdsToColorSelection).map(([layerId, color]) => (
          <RemoteSelection
            key={layerId}
            layerId={layerId}
            color={color}
            scale={camera.scale}
          />
        ))}
        <SelectionBox
          onResizeHandlePointerDown={onResizeHandlePointerDown}
          scale={camera.scale}
        />
        {canvasState.mode === CanvasMode.SelectingNet &&
          canvasState.origin != null &&
          canvasState.current != null && (
            <rect
              className='fill-[#0f8fd6]/10 stroke-[#0f8fd6]'
              strokeWidth={1 / camera.scale}
              x={Math.min(canvasState.origin.x, canvasState.current.x)}
              y={Math.min(canvasState.origin.y, canvasState.current.y)}
              width={Math.abs(canvasState.origin.x - canvasState.current.x)}
              height={Math.abs(canvasState.origin.y - canvasState.current.y)}
            />
          )}
        {canvasState.mode === CanvasMode.Inserting &&
          canvasState.origin != null &&
          canvasState.current != null &&
          canvasState.layerType != null && (
            <InsertPreview
              layerType={canvasState.layerType}
              origin={canvasState.origin}
              current={canvasState.current}
              style={style}
            />
          )}
        <CursorsPresence />
        {pencilDraft != null && pencilDraft.length > 0 && (
          <Path
            points={pencilDraft}
            fill={colorToCss(lastUsedColor)}
            strokeWidth={style.strokeWidth}
            opacity={style.opacity / 100}
            x={0}
            y={0}
          />
        )}
      </g>
    </svg>
  );
};

export default CanvasObjects;
