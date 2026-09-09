import { Minus, Plus } from 'lucide-react';
import React from 'react';

import useCanvas from '@/hooks/useCanvas';

import Hint from '@/components/common/Hint';

interface CanvasZoomProps {
  canvasActions: ReturnType<typeof useCanvas>;
}

const CanvasZoom: React.FC<CanvasZoomProps> = ({
  canvasActions,
}): JSX.Element => {
  const { camera, zoomIn, zoomOut, resetZoom } = canvasActions;

  return (
    <div className='canvas-panel absolute right-3 bottom-3 flex items-center gap-1 p-1.5'>
      <Hint label='Zoom out' side='top' sideOffset={12}>
        <button onClick={zoomOut} className='tool-button'>
          <Minus className='h-[18px] w-[18px]' />
        </button>
      </Hint>
      <Hint label='Reset to 100%' side='top' sideOffset={12}>
        <button
          onClick={resetZoom}
          className='min-w-[62px] rounded-[12px] px-2 py-2 text-[14px] font-bold tabular-nums transition-colors hover:bg-[color:var(--candy-surface)]'
          style={{ color: 'var(--candy-ink)' }}
        >
          {Math.round(camera.scale * 100)}%
        </button>
      </Hint>
      <Hint label='Zoom in' side='top' sideOffset={12}>
        <button onClick={zoomIn} className='tool-button'>
          <Plus className='h-[18px] w-[18px]' />
        </button>
      </Hint>
    </div>
  );
};
export default CanvasZoom;
