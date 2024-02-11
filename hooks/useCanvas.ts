/* eslint-disable unused-imports/no-unused-vars */
'use client';

import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';

import { pointerEventToCanvasPoint } from '@/lib/utils';

import { useHistory, useMutation, useStorage } from '@/liveblocks.config';

import {
  Camera,
  CanvasMode,
  Color,
  LayerType,
  Point,
  TCanvasState,
} from '@/types/TCanvasState';

const MAX_LAYERS = 100;

const useCanvas = ({
  setCanvasState,
  canvasState,
}: {
  setCanvasState: (newState: TCanvasState) => void;
  canvasState: TCanvasState;
}) => {
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
  });

  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const layerIds = useStorage((s) => s.layerIds);

  const history = useHistory();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      const allLayers = storage.get('layers');

      if (allLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get('layerIds');

      const layerId = nanoid();

      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      allLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({
        mode: CanvasMode.None,
        layerType: canvasState?.layerType as any,
      });
    },
    [lastUsedColor]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);
      setMyPresence({ cursor: current });
    },
    []
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      e.preventDefault();

      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType as any, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
          layerType: undefined,
        });
      }

      history.resume();
    },
    [canvasState, camera, insertLayer, history]
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }));
  }, []);

  return { onPointerMove, onPointerLeave, onWheel, onPointerUp, camera };
};

export default useCanvas;
