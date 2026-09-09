 
'use client';

import { LiveObject } from '@liveblocks/client';
import { shallow } from '@liveblocks/react';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  layerBoxFromDrag,
  segmentPoints,
  snapSegment,
  squarePoint,
} from '@/lib/canvas-geometry';
import { topmostHit } from '@/lib/canvas-hit';
import { claimPointer, surfaceOf } from '@/lib/canvas-pointer';
import { ScalableLayer, scaleLayer } from '@/lib/canvas-resize';
import {
  colorToCss,
  cssToColor,
  DEFAULT_FILLS,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  randomBorderColor,
} from '@/lib/utils';
import useBounds from '@/hooks/useBounds';
import useCamera from '@/hooks/useCamera';
import useDeleteLayer from '@/hooks/useDeleteLayer';
import useDisableScroll from '@/hooks/useDisableScroll';
import useDuplicateLayers from '@/hooks/useDuplicateLayers';
import useShortcuts from '@/hooks/useShortcuts';

import { CanvasStyle,DEFAULT_STYLE } from '@/constant/canvas';
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from '@/liveblocks.config';

import {
  CanvasMode,
  LayerStyle,
  LayerType,
  Point,
  Side,
  TCanvasState,
  XYWH,
} from '@/types/TCanvasState';

const MAX_LAYERS = 100;
const SELECTION_NET_THRESHOLD = 5;

const DRAG_MODES = [
  CanvasMode.Pressing,
  CanvasMode.SelectingNet,
  CanvasMode.Translating,
  CanvasMode.Resizing,
  CanvasMode.Panning,
];

const useCanvas = ({
  setCanvasState,
  canvasState,
}: {
  setCanvasState: (newState: TCanvasState) => void;
  canvasState: TCanvasState;
}) => {
  useDisableScroll();

  const deleteLayer = useDeleteLayer();
  const duplicateLayers = useDuplicateLayers();

  const [toolStyle, setToolStyle] = useState<CanvasStyle>(DEFAULT_STYLE);

  const selection = useSelf((me) => me.presence.selection);

  /* Read back as css strings so the selector stays comparable by value and a
     drag somewhere else on the board does not re-render the panel. */
  const selectedStyle = useStorage((root) => {
    const layer = selection?.length ? root.layers[selection[0]] : null;

    if (!layer) return null;

    return {
      stroke: colorToCss(layer.stroke ?? layer.fill),
      background: layer.filled === false ? null : colorToCss(layer.fill),
      strokeWidth: layer.strokeWidth ?? DEFAULT_STYLE.strokeWidth,
      strokeStyle: layer.strokeStyle ?? DEFAULT_STYLE.strokeStyle,
      edges: layer.edges ?? DEFAULT_STYLE.edges,
      opacity: layer.opacity ?? DEFAULT_STYLE.opacity,
    };
  }, shallow);

  const applyStyleToSelection = useMutation(
    ({ storage, self }, patch: Partial<CanvasStyle>) => {
      if (!self.presence.selection.length) return;

      const liveLayers = storage.get('layers');

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (!layer) continue;

        const type = layer.get('type');
        const update: Partial<LayerStyle> = {};

        if (patch.stroke) update.stroke = patch.stroke;
        if (patch.strokeWidth != null) update.strokeWidth = patch.strokeWidth;
        if (patch.strokeStyle) update.strokeStyle = patch.strokeStyle;
        if (patch.edges) update.edges = patch.edges;
        if (patch.opacity != null) update.opacity = patch.opacity;

        /* Ink has no background to fill: a line or a letter is only its
           colour, so the swatch would otherwise erase it. */
        const isInk =
          type === LayerType.Text ||
          type === LayerType.Arrow ||
          type === LayerType.Line ||
          type === LayerType.Path;

        if (patch.background !== undefined && !isInk) {
          if (type === LayerType.Note) {
            update.fill = patch.background ?? DEFAULT_FILLS.note;
            update.filled = true;
          } else {
            update.fill =
              patch.background ??
              patch.stroke ??
              layer.get('stroke') ??
              layer.get('fill');
            update.filled = patch.background != null;
          }
        }

        layer.update(update as never);
      }
    },
    []
  );

  const setStyle = useCallback(
    (patch: Partial<CanvasStyle>) => {
      setToolStyle((current) => ({ ...current, ...patch }));
      applyStyleToSelection(patch);
    },
    [applyStyleToSelection]
  );

  /* What the panel shows is whatever is selected, and the tool's own settings
     when nothing is. Derived rather than copied, so the two cannot drift. */
  const style = useMemo<CanvasStyle>(
    () =>
      selectedStyle
        ? {
            stroke: cssToColor(selectedStyle.stroke),
            background: selectedStyle.background
              ? cssToColor(selectedStyle.background)
              : null,
            strokeWidth: selectedStyle.strokeWidth,
            strokeStyle: selectedStyle.strokeStyle,
            edges: selectedStyle.edges,
            opacity: selectedStyle.opacity,
          }
        : toolStyle,
    [selectedStyle, toolStyle]
  );

  const lastUsedColor = style.stroke;

  /* Screen-space anchor for a pan in progress, and whether space is held. */
  const panAnchor = useRef<Point | null>(null);
  const spaceHeld = useRef(false);

  /* Every move of a resize handle scales from where the layers were when the
     drag started, otherwise the scaling compounds on itself. */
  const initialLayers = useRef<Record<string, ScalableLayer>>({});

  const layerIds = useStorage((s) => s.layerIds);

  const history = useHistory();

  const { resizeBox } = useBounds();

  const { camera, onWheel, zoomIn, zoomOut, resetZoom, panBy } = useCamera();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType,
      origin: Point,
      current?: Point
    ) => {
      const allLayers = storage.get('layers');

      if (allLayers.size >= MAX_LAYERS) {
        toast.error(`A board holds up to ${MAX_LAYERS} objects.`);
        setCanvasState({ mode: CanvasMode.None, layerType: undefined });
        return;
      }

      const liveLayerIds = storage.get('layerIds');
      const layerId = nanoid();

      const isSegment =
        layerType === LayerType.Arrow || layerType === LayerType.Line;

      const { box } = layerBoxFromDrag(origin, current);

      /* A note is its paper and text is its ink, so neither can take the
         "no background" that leaves a shape as an outline. */
      const isNote = layerType === LayerType.Note;
      const isInk = layerType === LayerType.Text || isSegment;

      const shared = {
        ...box,
        fill: isNote
          ? (style.background ?? DEFAULT_FILLS.note)
          : (style.background ?? style.stroke),
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
        strokeStyle: style.strokeStyle,
        edges: style.edges,
        opacity: style.opacity,
        filled: isNote || isInk ? true : style.background != null,
      };

      /* A segment keeps the drag direction, which a plain bounding box would
         lose: both diagonals produce the same box. */
      const layer = isSegment
        ? new LiveObject({
            ...shared,
            type: layerType,
            points: segmentPoints(origin, current, box),
          })
        : new LiveObject({ ...shared, type: layerType });

      liveLayerIds.push(layerId);
      allLayers.set(layerId, layer as never);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None, layerType: undefined });
    },
    [style]
  );

  const eraseAt = useMutation(
    ({ storage, setMyPresence }, point: Point) => {
      const liveLayers = storage.get('layers');
      const liveLayerIds = storage.get('layerIds');
      const layers = new Map(Object.entries(liveLayers.toJSON()));

      const id = topmostHit(layerIds, layers, point);

      if (!id) return;

      liveLayers.delete(id);
      const at = liveLayerIds.indexOf(id);
      if (at !== -1) liveLayerIds.delete(at);
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [layerIds]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }

      const { box, flipX, flipY } = resizeBox(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get('layers');
      const initial = initialLayers.current;

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        const before = initial[id];

        if (!layer || !before) continue;

        layer.update(
          scaleLayer(before, canvasState.initialBounds, box, {
            flipX,
            flipY,
          }) as never
        );
      }
    },
    [canvasState]
  );

  const startMultiSelect = useCallback((current: Point, origin: Point) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
      SELECTION_NET_THRESHOLD
    ) {
      setCanvasState({
        mode: CanvasMode.SelectingNet,
        origin,
        current,
        layerType: undefined,
      });
    }
  }, [setCanvasState]);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      if (!origin) {
        return;
      }

      const layers = new Map(Object.entries(storage.get('layers').toJSON()));
      setCanvasState({
        mode: CanvasMode.SelectingNet,
        origin,
        current,
        layerType: canvasState.layerType as any,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get('layers');
      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        if (liveLayers.size >= MAX_LAYERS) {
          toast.error(`A board holds up to ${MAX_LAYERS} objects.`);
        }

        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject({
          ...penPointsToPathLayer(pencilDraft, style.stroke),
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          opacity: style.opacity,
        })
      );

      const liveLayerIds = storage.get('layerIds');
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({
        mode: CanvasMode.Pencil,
        layerType: undefined,
      });
    },
    [style]
  );

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get('layers');

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          });
        }
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
        layerType: canvasState.layerType,
      });
    },
    [canvasState]
  );

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      const current = pointerEventToCanvasPoint(e, camera);

      /* A gesture whose pointer-up went missing would otherwise follow the
         cursor for ever. */
      if (e.buttons === 0 && DRAG_MODES.includes(canvasState.mode)) {
        panAnchor.current = null;
        setCanvasState({ mode: CanvasMode.None, layerType: undefined });
        history.resume();
        setMyPresence({ cursor: current });
        return;
      }

      if (canvasState.mode === CanvasMode.Panning) {
        const anchor = panAnchor.current;
        if (anchor) {
          panBy(e.clientX - anchor.x, e.clientY - anchor.y);
          panAnchor.current = { x: e.clientX, y: e.clientY };
        }
        return;
      } else if (
        canvasState.mode === CanvasMode.Erasing &&
        e.buttons === 1
      ) {
        eraseAt(current);
      } else if (
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.origin != null
      ) {
        const isSegment =
          canvasState.layerType === LayerType.Arrow ||
          canvasState.layerType === LayerType.Line;

        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: canvasState.layerType,
          origin: canvasState.origin,
          current: e.shiftKey
            ? isSegment
              ? snapSegment(canvasState.origin, current)
              : squarePoint(canvasState.origin, current)
            : current,
        });
      } else if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelect(current, canvasState.origin);
      } else if (
        canvasState.mode === CanvasMode.SelectingNet &&
        canvasState.origin != null
      ) {
        updateSelectionNet(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, camera, history, resizeSelectedLayer, translateSelectedLayers]
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const unSelectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        unSelectLayers();
        setCanvasState({
          mode: CanvasMode.None,
          layerType: canvasState.layerType,
        });
      } else if (canvasState.mode === CanvasMode.Panning) {
        panAnchor.current = null;
        setCanvasState({ mode: canvasState.returnTo, layerType: undefined });
      } else if (canvasState.mode === CanvasMode.Erasing) {
        return;
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        if (canvasState.layerType != null) {
          insertLayer(
            canvasState.layerType,
            canvasState.origin ?? point,
            canvasState.current ?? point
          );
        } else {
          setCanvasState({ mode: CanvasMode.None, layerType: undefined });
        }
      } else {
        setCanvasState({
          mode: CanvasMode.None,
          layerType: canvasState.layerType,
        });
      }

      history.resume();
    },
    [canvasState, camera, insertLayer, history, unSelectLayers, panBy]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      claimPointer(e, e.currentTarget);

      const point = pointerEventToCanvasPoint(e, camera);

      const wantsPan =
        e.button === 1 ||
        spaceHeld.current ||
        canvasState.mode === CanvasMode.Hand;

      if (wantsPan) {
        panAnchor.current = { x: e.clientX, y: e.clientY };
        setCanvasState({
          mode: CanvasMode.Panning,
          layerType: undefined,
          returnTo:
            canvasState.mode === CanvasMode.Hand
              ? CanvasMode.Hand
              : CanvasMode.None,
        });
        return;
      }

      if (e.button !== 0) {
        return;
      }

      if (canvasState.mode === CanvasMode.Erasing) {
        eraseAt(point);
        return;
      }

      if (canvasState.mode === CanvasMode.Inserting) {
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: canvasState.layerType,
          origin: point,
          current: point,
        });
        return;
      }

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({
        origin: point,
        mode: CanvasMode.Pressing,
        layerType: canvasState.layerType,
      });
    },
    [camera, canvasState, eraseAt, setCanvasState, startDrawing]
  );

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      /* Tools that act on the surface have to reach it: the eraser, the pen
         and the hand must not be swallowed by the shape under the pointer. */
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Erasing ||
        canvasState.mode === CanvasMode.Hand ||
        canvasState.mode === CanvasMode.Panning ||
        spaceHeld.current ||
        e.button !== 0
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();
      claimPointer(e, surfaceOf(e.currentTarget as Element));

      const point = pointerEventToCanvasPoint(e, camera);
      const selection = self.presence.selection;

      /* Alt turns a drag into a copy: the original stays put and the new one
         comes along with the pointer. */
      if (e.altKey) {
        if (!selection.includes(layerId)) {
          setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        duplicateLayers(0);
        setCanvasState({
          mode: CanvasMode.Translating,
          current: point,
          layerType: undefined,
        });
        return;
      }

      if (e.shiftKey) {
        setMyPresence(
          {
            selection: selection.includes(layerId)
              ? selection.filter((id) => id !== layerId)
              : [...selection, layerId],
          },
          { addToHistory: true }
        );
      } else if (!selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
        layerType: canvasState.layerType,
      });
    },
    [setCanvasState, camera, history, canvasState.mode, duplicateLayers]
  );

  const selectAll = useMutation(
    ({ setMyPresence }) => {
      setMyPresence({ selection: [...layerIds] }, { addToHistory: true });
    },
    [layerIds]
  );

  const nudgeLayers = useMutation(
    ({ storage, self }, dx: number, dy: number) => {
      const liveLayers = storage.get('layers');

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({ x: layer.get('x') + dx, y: layer.get('y') + dy });
        }
      }
    },
    []
  );

  const onPointerCancel = useMutation(
    ({ setMyPresence }) => {
      panAnchor.current = null;
      setMyPresence({ pencilDraft: null });

      if (canvasState.mode === CanvasMode.Inserting) {
        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: canvasState.layerType,
        });
      } else if (
        canvasState.mode !== CanvasMode.Pencil &&
        canvasState.mode !== CanvasMode.Erasing &&
        canvasState.mode !== CanvasMode.Hand
      ) {
        setCanvasState({ mode: CanvasMode.None, layerType: undefined });
      }

      history.resume();
    },
    [canvasState, history]
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

  const onResizeHandlePointerDown = useMutation(
    ({ storage, self }, corner: Side, initialBounds: XYWH) => {
      const layers = storage.get('layers').toJSON();
      const snapshot: Record<string, ScalableLayer> = {};

      for (const id of self.presence.selection) {
        const layer = layers[id];

        if (layer) {
          snapshot[id] = {
            x: layer.x,
            y: layer.y,
            width: layer.width,
            height: layer.height,
            points: 'points' in layer ? layer.points : undefined,
          };
        }
      }

      initialLayers.current = snapshot;

      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
        layerType: undefined,
      });
    },
    [history, setCanvasState]
  );

  useShortcuts({
    deleteLayers: deleteLayer,
    duplicateLayers,
    unSelectLayers,
    selectAll,
    nudgeLayers,
    zoomIn,
    zoomOut,
    resetZoom,
    setCanvasState,
    spaceHeld,
  });

  return {
    onPointerMove,
    onPointerCancel,
    onPointerLeave,
    onWheel,
    duplicateLayers,
    onPointerUp,
    onPointerDown,
    onLayerPointerDown,
    onResizeHandlePointerDown,
    style,
    setStyle,
    spaceHeld,
    lastUsedColor,
    layerIdsToColorSelection,
    camera,
    layerIds,
    zoomIn,
    zoomOut,
    resetZoom,
  };
};

export default useCanvas;
