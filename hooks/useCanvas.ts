/* eslint-disable unused-imports/no-unused-vars */
'use client';

import { LiveObject } from '@liveblocks/client';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState } from 'react';

import { pointerEventToCanvasPoint, randomBorderColor } from '@/lib/utils';
import useBounds from '@/hooks/useBounds';

import {
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from '@/liveblocks.config';

import {
  Camera,
  CanvasMode,
  Color,
  LayerType,
  Point,
  Side,
  TCanvasState,
  XYWH,
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
    r: 255,
    g: 255,
    b: 255,
  });

  const layerIds = useStorage((s) => s.layerIds);

  const history = useHistory();

  const { resizeBounds } = useBounds();

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

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get('layers');
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, resizeSelectedLayer]
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

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
        layerType: canvasState.layerType,
      });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = randomBorderColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
        layerType: canvasState.layerType as any,
      });
    },
    [history]
  );

  return {
    onPointerMove,
    onPointerLeave,
    onWheel,
    onPointerUp,
    onLayerPointerDown,
    layerIdsToColorSelection,
    onResizeHandlePointerDown,
    camera,
    layerIds,
  };
};

export default useCanvas;
