 
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
import { ERASER_RADIUS, hitsAlongSegment } from '@/lib/canvas-hit';
import { claimPointer, surfaceOf } from '@/lib/canvas-pointer';
import { ScalableLayer, scaleLayer } from '@/lib/canvas-resize';
import {
  colorToCss,
  cssToColor,
  DEFAULT_FILLS,
  findLayersTouchingRectangle,
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

import {
  CanvasStyle,
  DEFAULT_SHAPE_SIZE,
  DEFAULT_STYLE,
} from '@/constant/canvas';
import {
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from '@/liveblocks.config';

import {
  CanvasMode,
  Layer,
  LayerStyle,
  LayerType,
  Point,
  Side,
  TCanvasState,
  XYWH,
} from '@/types/TCanvasState';

const MAX_LAYERS = 100;
const SELECTION_NET_THRESHOLD = 5;
const ERASER_TRAIL_POINTS = 48;

const TOOL_MODES = [
  CanvasMode.Inserting,
  CanvasMode.Pencil,
  CanvasMode.Erasing,
  CanvasMode.Hand,
];

/* The tool a gesture belongs to, with the half finished gesture stripped off:
   panning away and back must not restore a stale drag. */
const toolOf = (state: TCanvasState): TCanvasState => {
  if (state.mode === CanvasMode.Inserting) {
    return { mode: CanvasMode.Inserting, layerType: state.layerType };
  }

  if (
    state.mode === CanvasMode.Pencil ||
    state.mode === CanvasMode.Erasing ||
    state.mode === CanvasMode.Hand
  ) {
    return state;
  }

  return { mode: CanvasMode.None, layerType: undefined };
};

const INK_LAYERS = [
  LayerType.Text,
  LayerType.Arrow,
  LayerType.Line,
  LayerType.Path,
];

type EraserStroke = { trail: number[][]; marked: string[] };

const NO_ERASER: EraserStroke = { trail: [], marked: [] };

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
  const { duplicateLayers, duplicateInPlace } = useDuplicateLayers();

  const [toolStyle, setToolStyle] = useState<CanvasStyle>(DEFAULT_STYLE);

  const selection = useSelf((me) => me.presence.selection);

  /* Read back as css strings so the selector stays comparable by value and a
     drag somewhere else on the board does not re-render the panel. */
  const selectedStyle = useStorage((root) => {
    const layer = selection?.length ? root.layers[selection[0]] : null;

    if (!layer) return null;

    /* A line, a letter or a pen stroke is only its colour. Reading its fill
       back as a background would hand that colour to the next shape drawn. */
    const isInk = INK_LAYERS.includes(layer.type);

    return {
      stroke: colorToCss(layer.stroke ?? layer.fill),
      background:
        isInk || layer.filled === false ? null : colorToCss(layer.fill),
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
        const isInk = INK_LAYERS.includes(type);

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

  /* The eraser marks as it sweeps and only deletes when the button comes up,
     so a stroke can be seen before it is committed. */
  const [eraser, setEraser] = useState<EraserStroke>(NO_ERASER);
  const eraserAnchor = useRef<Point | null>(null);

  /* What was already selected when a shift-marquee started. */
  const marqueeBase = useRef<string[]>([]);

  /* True from pointer-down to pointer-up. Undo in the middle of a drag would
     take the half finished move off the stack and leave storage ahead of it. */
  const isGesturing = useRef(false);

  /* The one layer whose text is open for editing. */
  const [editingId, setEditingId] = useState<string | null>(null);

  const layerIds = useStorage((s) => s.layerIds);

  const history = useHistory();

  /* Every tool switch goes through here. A gesture that was still running has
     to be cleaned up, or its leftovers outlive it: a half drawn stroke that
     every other person in the room keeps seeing, layers left ghosted under
     the eraser, a pan anchor, a paused history. */
  const changeMode = useMutation(
    ({ self, setMyPresence }, next: TCanvasState) => {
      if (
        canvasState.mode === CanvasMode.Pencil &&
        self.presence.pencilDraft != null
      ) {
        setMyPresence({ pencilDraft: null });
      }

      if (eraserAnchor.current || eraser.marked.length) {
        eraserAnchor.current = null;
        setEraser(NO_ERASER);
      }

      setMyPresence({ draft: null });

      panAnchor.current = null;
      marqueeBase.current = [];
      setEditingId(null);
      history.resume();

      /* Picking a tool drops the selection, so the next shape is drawn in the
         tool's own style instead of inheriting the last selected shape's. */
      if (TOOL_MODES.includes(next.mode) && self.presence.selection.length) {
        setMyPresence({ selection: [] }, { addToHistory: true });
      }

      setCanvasState(next);
    },
    [canvasState.mode, eraser.marked.length, history, setCanvasState]
  );

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

      /* A click with no drag has to become a real segment, not a zero length
         one hidden inside a default box. */
      const end =
        isSegment && !layerBoxFromDrag(origin, current).dragged
          ? { x: origin.x + DEFAULT_SHAPE_SIZE, y: origin.y }
          : current;

      const { box } = isSegment
        ? layerBoxFromDrag(origin, end ?? origin, DEFAULT_SHAPE_SIZE)
        : layerBoxFromDrag(origin, current);

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
            points: segmentPoints(origin, end, box),
          })
        : new LiveObject({ ...shared, type: layerType });

      liveLayerIds.push(layerId);
      allLayers.set(layerId, layer as never);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setEditingId(
        layerType === LayerType.Text || layerType === LayerType.Note
          ? layerId
          : null
      );
      setCanvasState({ mode: CanvasMode.None, layerType: undefined });
    },
    [style]
  );

  const sweepEraser = useMutation(
    ({ storage }, from: Point, to: Point, tolerance: number) => {
      const layers = new Map(
        Object.entries(storage.get('layers').toJSON())
      ) as ReadonlyMap<string, Layer>;

      const hits = hitsAlongSegment(layerIds, layers, from, to, tolerance);

      setEraser((current) => {
        const marked = hits.length
          ? [...new Set([...current.marked, ...hits])]
          : current.marked;

        return {
          marked,
          trail: [...current.trail, [to.x, to.y]].slice(-ERASER_TRAIL_POINTS),
        };
      });
    },
    [layerIds]
  );

  const commitErase = useMutation(
    ({ storage, setMyPresence }, marked: string[]) => {
      if (!marked.length) return;

      const liveLayers = storage.get('layers');
      const liveLayerIds = storage.get('layerIds');

      for (const id of marked) {
        liveLayers.delete(id);

        const index = liveLayerIds.indexOf(id);

        if (index !== -1) liveLayerIds.delete(index);
      }

      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    []
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
        layerType: undefined,
      });

      const ids = findLayersTouchingRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      /* Shift adds to what was already picked instead of starting over. */
      const kept = marqueeBase.current;

      setMyPresence({
        selection: kept.length ? [...new Set([...kept, ...ids])] : ids,
      });
    },
    [layerIds]
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: style.stroke,
        penWidth: style.strokeWidth,
        penOpacity: style.opacity,
      });
    },
    [style]
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
    ({ self, setMyPresence }, e: React.PointerEvent) => {
      const current = pointerEventToCanvasPoint(e, camera);

      /* Nothing is held, so no gesture can still be in progress. Whatever the
         last one left behind is cleared here, because a pointer-up that never
         arrived would otherwise strand the board: a shape following the
         cursor, or the ghost of a shape that was never committed sitting on
         top of everything. */
      if (e.buttons === 0) {
        isGesturing.current = false;

        if (canvasState.mode === CanvasMode.Erasing && eraserAnchor.current) {
          /* A release nobody saw is not a reliable instruction to delete. */
          eraserAnchor.current = null;
          setEraser(NO_ERASER);
          setMyPresence({ cursor: current });
          return;
        }

        if (
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.origin != null
        ) {
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: canvasState.layerType,
          });
          setMyPresence({ cursor: current });
          return;
        }

        if (
          canvasState.mode === CanvasMode.Pencil &&
          self.presence.pencilDraft != null
        ) {
          insertPath();
          setMyPresence({ cursor: current });
          return;
        }

        if (DRAG_MODES.includes(canvasState.mode)) {
          panAnchor.current = null;
          setCanvasState({ mode: CanvasMode.None, layerType: undefined });
          history.resume();
          setMyPresence({ cursor: current });
          return;
        }
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
        const from = eraserAnchor.current ?? current;

        eraserAnchor.current = current;
        sweepEraser(from, current, ERASER_RADIUS / camera.scale);
      } else if (
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.origin != null
      ) {
        const isSegment =
          canvasState.layerType === LayerType.Arrow ||
          canvasState.layerType === LayerType.Line;

        const shaped = e.shiftKey
          ? isSegment
            ? snapSegment(canvasState.origin, current)
            : squarePoint(canvasState.origin, current)
          : current;

        setCanvasState({
          mode: CanvasMode.Inserting,
          layerType: canvasState.layerType,
          origin: canvasState.origin,
          current: shaped,
        });

        if (canvasState.layerType != null) {
          setMyPresence({
            draft: {
              layerType: canvasState.layerType,
              origin: canvasState.origin,
              current: shaped,
              style,
            },
          });
        }
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
    [
      canvasState,
      camera,
      history,
      insertPath,
      resizeSelectedLayer,
      style,
      sweepEraser,
      translateSelectedLayers,
    ]
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
    ({ setMyPresence }, e: React.PointerEvent) => {
      if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      isGesturing.current = false;
      marqueeBase.current = [];
      setMyPresence({ draft: null });

      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        if (!e.shiftKey) unSelectLayers();
        setCanvasState({
          mode: CanvasMode.None,
          layerType: canvasState.layerType,
        });
      } else if (canvasState.mode === CanvasMode.Panning) {
        panAnchor.current = null;
        setCanvasState(canvasState.returnTo);
      } else if (canvasState.mode === CanvasMode.Erasing) {
        commitErase(eraser.marked);
        eraserAnchor.current = null;
        setEraser(NO_ERASER);
        history.resume();
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
    [
      canvasState,
      camera,
      commitErase,
      eraser,
      history,
      insertLayer,
      panBy,
      unSelectLayers,
    ]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      claimPointer(e, e.currentTarget);
      isGesturing.current = true;
      setEditingId(null);

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
            canvasState.mode === CanvasMode.Panning
              ? canvasState.returnTo
              : toolOf(canvasState),
        });
        return;
      }

      if (e.button !== 0) {
        return;
      }

      if (canvasState.mode === CanvasMode.Erasing) {
        eraserAnchor.current = point;
        setEraser({ trail: [[point.x, point.y]], marked: [] });
        sweepEraser(point, point, ERASER_RADIUS / camera.scale);
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

      /* Shift keeps what was already picked, so a marquee can add to it. */
      marqueeBase.current = e.shiftKey ? [...(selection ?? [])] : [];

      setCanvasState({
        origin: point,
        mode: CanvasMode.Pressing,
        layerType: undefined,
      });
    },
    [camera, canvasState, selection, setCanvasState, startDrawing, sweepEraser]
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
      isGesturing.current = true;

      const point = pointerEventToCanvasPoint(e, camera);
      const selection = self.presence.selection;

      setEditingId((current) => (current === layerId ? current : null));

      /* Alt turns a drag into a copy: the original stays put and the new one
         comes along with the pointer. */
      if (e.altKey) {
        if (!selection.includes(layerId)) {
          setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        duplicateInPlace();
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
    [setCanvasState, camera, history, canvasState.mode, duplicateInPlace]
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
      eraserAnchor.current = null;
      isGesturing.current = false;
      marqueeBase.current = [];
      setMyPresence({ draft: null });
      setEraser(NO_ERASER);
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
      isGesturing.current = true;

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
    setCanvasState: changeMode,
    isGesturing,
    spaceHeld,
  });

  const pauseHistory = useCallback(() => history.pause(), [history]);
  const resumeHistory = useCallback(() => history.resume(), [history]);

  return {
    eraser,
    editingId,
    setEditingId,
    setCanvasState: changeMode,
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
    pauseHistory,
    resumeHistory,
  };
};

export default useCanvas;
