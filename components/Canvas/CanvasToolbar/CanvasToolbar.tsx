'use client';

import {
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Minus,
  MousePointer2,
  MoveRight,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from 'lucide-react';
import React from 'react';

import useCanvas from '@/hooks/useCanvas';

import ToolbarItem from '@/components/Canvas/CanvasToolbar/Partials/ToolbarItem';

import { useCanRedo, useCanUndo, useHistory } from '@/liveblocks.config';

import { CanvasMode, LayerType, TCanvasState } from '@/types/TCanvasState';

interface ToolbarProps {
  canvasActions: ReturnType<typeof useCanvas>;
  canvasState: TCanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<TCanvasState>>;
}

const CanvasToolbar: React.FC<ToolbarProps> = ({
  canvasState,
  setCanvasState,
}): JSX.Element => {
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  const { redo, undo } = useHistory();

  const selectActiveModes = [
    CanvasMode.None,
    CanvasMode.SelectingNet,
    CanvasMode.Translating,
    CanvasMode.Pressing,
    CanvasMode.Resizing,
  ];

  const isInserting = (layerType: LayerType) =>
    canvasState.mode === CanvasMode.Inserting &&
    canvasState.layerType === layerType;

  const tools: {
    label: string;
    shortcut?: string;
    Icon: React.FC<{ className?: string }>;
    isActive: boolean;
    state: TCanvasState;
  }[] = [
    {
      label: 'Hand (1)',
      shortcut: '1',
      Icon: Hand,
      isActive: canvasState.mode === CanvasMode.Hand,
      state: { mode: CanvasMode.Hand, layerType: undefined },
    },
    {
      label: 'Select (2)',
      shortcut: '2',
      Icon: MousePointer2,
      isActive: selectActiveModes.includes(canvasState.mode),
      state: { mode: CanvasMode.None, layerType: undefined },
    },
    {
      label: 'Rectangle (3)',
      shortcut: '3',
      Icon: Square,
      isActive: isInserting(LayerType.Rectangle),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Rectangle },
    },
    {
      label: 'Diamond (4)',
      shortcut: '4',
      Icon: Diamond,
      isActive: isInserting(LayerType.Diamond),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Diamond },
    },
    {
      label: 'Ellipse (5)',
      shortcut: '5',
      Icon: Circle,
      isActive: isInserting(LayerType.Ellipse),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Ellipse },
    },
    {
      label: 'Arrow (6)',
      shortcut: '6',
      Icon: MoveRight,
      isActive: isInserting(LayerType.Arrow),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Arrow },
    },
    {
      label: 'Line (7)',
      shortcut: '7',
      Icon: Minus,
      isActive: isInserting(LayerType.Line),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Line },
    },
    {
      label: 'Draw (8)',
      shortcut: '8',
      Icon: Pencil,
      isActive: canvasState.mode === CanvasMode.Pencil,
      state: { mode: CanvasMode.Pencil, layerType: undefined },
    },
    {
      label: 'Text (9)',
      shortcut: '9',
      Icon: Type,
      isActive: isInserting(LayerType.Text),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Text },
    },
    {
      label: 'Note (0)',
      shortcut: '0',
      Icon: StickyNote,
      isActive: isInserting(LayerType.Note),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Note },
    },
    {
      label: 'Image',
      Icon: Image,
      isActive: isInserting(LayerType.Image),
      state: { mode: CanvasMode.Inserting, layerType: LayerType.Image },
    },
    {
      label: 'Eraser (E)',
      shortcut: 'E',
      Icon: Eraser,
      isActive: canvasState.mode === CanvasMode.Erasing,
      state: { mode: CanvasMode.Erasing, layerType: undefined },
    },
  ];

  const history = [
    {
      label: 'Undo (Ctrl+Z)',
      Icon: Undo2,
      handler: undo,
      isDisabled: !canUndo,
    },
    {
      label: 'Redo (Ctrl+Shift+Z)',
      Icon: Redo2,
      handler: redo,
      isDisabled: !canRedo,
    },
  ];

  return (
    <div className='canvas-panel absolute top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 p-1.5'>
      {tools.map((tool) => (
        <div key={tool.label} className='relative'>
          <ToolbarItem
            label={tool.label}
            Icon={tool.Icon}
            onClick={() => setCanvasState(tool.state)}
            isDisabled={false}
            isActive={tool.isActive}
          />
          {tool.shortcut && (
            <span
              className='pointer-events-none absolute right-1 bottom-0.5 text-[11px] leading-none'
              style={{ color: 'var(--candy-muted)' }}
            >
              {tool.shortcut}
            </span>
          )}
        </div>
      ))}
      <div
        className='mx-1 h-6 w-px'
        style={{ backgroundColor: 'rgba(0,18,52,0.16)' }}
      />
      {history.map((tool) => (
        <ToolbarItem
          key={tool.label}
          label={tool.label}
          Icon={tool.Icon}
          onClick={tool.handler}
          isDisabled={tool.isDisabled}
          isActive={false}
        />
      ))}
    </div>
  );
};
export default CanvasToolbar;
