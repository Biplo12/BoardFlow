import { MutableRefObject, useEffect } from 'react';

import { useHistory } from '@/liveblocks.config';

import { CanvasMode, LayerType, TCanvasState } from '@/types/TCanvasState';

const TOOL_KEYS: Record<string, TCanvasState> = {
  '1': { mode: CanvasMode.Hand, layerType: undefined },
  '2': { mode: CanvasMode.None, layerType: undefined },
  '3': { mode: CanvasMode.Inserting, layerType: LayerType.Rectangle },
  '4': { mode: CanvasMode.Inserting, layerType: LayerType.Diamond },
  '5': { mode: CanvasMode.Inserting, layerType: LayerType.Ellipse },
  '6': { mode: CanvasMode.Inserting, layerType: LayerType.Arrow },
  '7': { mode: CanvasMode.Inserting, layerType: LayerType.Line },
  '8': { mode: CanvasMode.Pencil, layerType: undefined },
  '9': { mode: CanvasMode.Inserting, layerType: LayerType.Text },
  '0': { mode: CanvasMode.Inserting, layerType: LayerType.Note },
  h: { mode: CanvasMode.Hand, layerType: undefined },
  v: { mode: CanvasMode.None, layerType: undefined },
  r: { mode: CanvasMode.Inserting, layerType: LayerType.Rectangle },
  d: { mode: CanvasMode.Inserting, layerType: LayerType.Diamond },
  o: { mode: CanvasMode.Inserting, layerType: LayerType.Ellipse },
  a: { mode: CanvasMode.Inserting, layerType: LayerType.Arrow },
  l: { mode: CanvasMode.Inserting, layerType: LayerType.Line },
  p: { mode: CanvasMode.Pencil, layerType: undefined },
  t: { mode: CanvasMode.Inserting, layerType: LayerType.Text },
  n: { mode: CanvasMode.Inserting, layerType: LayerType.Note },
  e: { mode: CanvasMode.Erasing, layerType: undefined },
};

const isTyping = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  );
};

const NUDGE = 1;
const NUDGE_FAR = 10;

const ARROW_KEYS: Record<string, [number, number]> = {
  arrowleft: [-1, 0],
  arrowright: [1, 0],
  arrowup: [0, -1],
  arrowdown: [0, 1],
};

interface ShortcutOptions {
  deleteLayers: () => void;
  duplicateLayers: () => void;
  unSelectLayers: () => void;
  selectAll: () => void;
  nudgeLayers: (dx: number, dy: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setCanvasState: (newState: TCanvasState) => void;
  isGesturing: MutableRefObject<boolean>;
  spaceHeld: MutableRefObject<boolean>;
}

const useShortcuts = ({
  deleteLayers,
  duplicateLayers,
  unSelectLayers,
  selectAll,
  nudgeLayers,
  zoomIn,
  zoomOut,
  resetZoom,
  setCanvasState,
  isGesturing,
  spaceHeld,
}: ShortcutOptions) => {
  const history = useHistory();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTyping(event.target)) return;

      const modifier = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      /* Space is held to pan, so the page must not scroll under it. */
      if (event.code === 'Space') {
        event.preventDefault();
        spaceHeld.current = true;
        return;
      }

      /* Undoing half way through a drag would pop the unfinished change off
         the stack and leave the board ahead of its own history. */
      if (modifier && (key === 'z' || key === 'y')) {
        event.preventDefault();

        if (isGesturing.current) return;

        if (key === 'y' || event.shiftKey) history.redo();
        else history.undo();

        return;
      }

      if (modifier && key === 'a') {
        event.preventDefault();
        selectAll();
        return;
      }

      if (modifier && (key === '=' || key === '+')) {
        event.preventDefault();
        zoomIn();
        return;
      }

      if (modifier && key === '-') {
        event.preventDefault();
        zoomOut();
        return;
      }

      if (modifier && key === '0') {
        event.preventDefault();
        resetZoom();
        return;
      }

      if (ARROW_KEYS[key]) {
        event.preventDefault();
        const [dx, dy] = ARROW_KEYS[key];
        const step = event.shiftKey ? NUDGE_FAR : NUDGE;
        nudgeLayers(dx * step, dy * step);
        return;
      }

      if (modifier && key === 'd') {
        event.preventDefault();
        duplicateLayers();
        return;
      }

      if (key === 'delete' || key === 'backspace') {
        event.preventDefault();
        deleteLayers();
        return;
      }

      if (key === 'escape') {
        unSelectLayers();
        setCanvasState({ mode: CanvasMode.None, layerType: undefined });
        return;
      }

      if (!modifier && TOOL_KEYS[key]) {
        event.preventDefault();
        setCanvasState(TOOL_KEYS[key]);
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === 'Space') {
        spaceHeld.current = false;
      }
    }

    /* A key-up that lands in another window never arrives here, which would
       leave the canvas stuck in pan mode with no way out. */
    function onBlur() {
      spaceHeld.current = false;
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [
    deleteLayers,
    duplicateLayers,
    history,
    isGesturing,
    nudgeLayers,
    resetZoom,
    selectAll,
    setCanvasState,
    spaceHeld,
    unSelectLayers,
    zoomIn,
    zoomOut,
  ]);

  return null;
};

export default useShortcuts;
