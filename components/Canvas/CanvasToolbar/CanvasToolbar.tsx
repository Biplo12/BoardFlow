import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from 'lucide-react';
import React from 'react';

import ToolbarItem from '@/components/Canvas/CanvasToolbar/Partials/ToolbarItem';

const tools = [
  {
    label: 'Select',
    Icon: MousePointer2,
  },
  {
    label: 'Text',
    Icon: Type,
  },
  {
    label: 'Sticky note',
    Icon: StickyNote,
  },
  {
    label: 'Rectangle',
    Icon: Square,
  },
  {
    label: 'Ellipse',
    Icon: Circle,
  },
  {
    label: 'Pen',
    Icon: Pencil,
  },
];

const history = [
  {
    label: 'Undo',
    Icon: Undo2,
  },
  {
    label: 'Redo',
    Icon: Redo2,
  },
];

const CanvasToolbar: React.FC = (): JSX.Element => {
  return (
    <div className='absolute left-2 top-[50%] flex -translate-y-[50%] flex-col gap-4'>
      <div className='flex flex-col items-center gap-1 rounded-md bg-white p-2 shadow-md'>
        {tools.map((tool, index) => (
          <ToolbarItem
            key={index}
            label={tool.label}
            Icon={tool.Icon}
            onClick={() => {}}
            isDisabled={false}
            isActive={false}
          />
        ))}
      </div>
      <div className='flex flex-col items-center rounded-md bg-white p-2 shadow-md'>
        {history.map((tool, index) => (
          <ToolbarItem
            key={index}
            label={tool.label}
            Icon={tool.Icon}
            onClick={() => {}}
            isDisabled={false}
            isActive={false}
          />
        ))}
      </div>
    </div>
  );
};
export default CanvasToolbar;
