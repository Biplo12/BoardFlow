/* eslint-disable unused-imports/no-unused-vars */
import {
  Circle,
  Image,
  MousePointer2,
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
import ColorPicker from '@/components/Canvas/SelectionTools/Tools/ColorPicker';

import { useCanRedo, useCanUndo, useHistory } from '@/liveblocks.config';

import { CanvasMode, LayerType, TCanvasState } from '@/types/TCanvasState';

interface ToolbarProps {
  canvasActions: ReturnType<typeof useCanvas>;
  canvasState: TCanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<TCanvasState>>;
}

const CanvasToolbar: React.FC<ToolbarProps> = ({
  canvasActions,
  canvasState,
  setCanvasState,
}): JSX.Element => {
  const { setLastUsedColor } = canvasActions;
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

  const tools = [
    {
      label: 'Select',
      Icon: MousePointer2,
      isActive: selectActiveModes.includes(canvasState.mode),
      mode: CanvasMode.SelectingNet,
    },
    {
      label: 'Text',
      Icon: Type,
      isActive:
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.layerType === LayerType.Text,
      mode: CanvasMode.Inserting,
      layerType: LayerType.Text,
    },
    {
      label: 'Sticky note',
      Icon: StickyNote,
      isActive:
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.layerType === LayerType.Note,
      mode: CanvasMode.Inserting,
      layerType: LayerType.Note,
    },
    {
      label: 'Rectangle',
      Icon: Square,
      isActive:
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.layerType === LayerType.Rectangle,
      mode: CanvasMode.Inserting,
      layerType: LayerType.Rectangle,
    },
    {
      label: 'Ellipse',
      Icon: Circle,
      isActive:
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.layerType === LayerType.Ellipse,
      mode: CanvasMode.Inserting,
      layerType: LayerType.Ellipse,
    },
    {
      label: 'Pen',
      Icon: Pencil,
      isActive: canvasState.mode === CanvasMode.Pencil,
      mode: CanvasMode.Pencil,
    },
    {
      label: 'Image',
      Icon: Image,
      isActive:
        canvasState.mode === CanvasMode.Inserting &&
        canvasState.layerType === LayerType.Image,
      mode: CanvasMode.Inserting,
      layerType: LayerType.Image,
    },
  ];

  const history = [
    {
      label: 'Undo',
      Icon: Undo2,
      handler: undo,
      isDisabled: !canUndo,
    },
    {
      label: 'Redo',
      Icon: Redo2,
      handler: redo,
      isDisabled: !canRedo,
    },
  ];

  const createCanvasState = (
    mode: CanvasMode,
    layerType: LayerType | undefined,
    additionalProps?: Partial<TCanvasState>
  ) => {
    if (layerType === undefined) {
      return {
        mode,
        layerType: undefined,
        ...additionalProps,
      };
    } else if (mode === CanvasMode.Inserting) {
      return {
        mode,
        layerType: layerType as
          | LayerType.Rectangle
          | LayerType.Ellipse
          | LayerType.Text
          | LayerType.Note,
        ...additionalProps,
      };
    } else {
      return {
        mode: mode as Exclude<CanvasMode, CanvasMode.Inserting>,
        layerType: undefined,
        ...additionalProps,
      };
    }
  };

  const handleToolClick = (
    mode: CanvasMode,
    layerType: LayerType | undefined
  ) => {
    const canvasState = createCanvasState(mode, layerType);
    setCanvasState(canvasState as TCanvasState);
  };

  return (
    <div className='absolute left-2 top-[70%] flex -translate-y-[70%] flex-col gap-4'>
      <div className='flex flex-col items-center gap-1 rounded-md bg-white p-2 shadow-md'>
        {tools.map((tool, index) => (
          <ToolbarItem
            key={index}
            label={tool.label}
            Icon={tool.Icon}
            onClick={() => handleToolClick(tool.mode, tool.layerType)}
            isDisabled={false}
            isActive={tool.isActive}
          />
        ))}
      </div>
      <div className='flex flex-col items-center rounded-md bg-white p-2 shadow-md'>
        {history.map((tool, index) => (
          <ToolbarItem
            key={index}
            label={tool.label}
            Icon={tool.Icon}
            onClick={tool.handler}
            isDisabled={tool.isDisabled}
            isActive={false}
          />
        ))}
      </div>
      <div className='flex max-w-16 flex-col items-center gap-1 rounded-md bg-white p-2 shadow-md'>
        <ColorPicker setLastUsedColor={setLastUsedColor} />
      </div>
    </div>
  );
};
export default CanvasToolbar;
