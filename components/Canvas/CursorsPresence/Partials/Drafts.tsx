import { shallow } from '@liveblocks/client';
import React from 'react';

import { colorToCss } from '@/lib/utils';

import InsertPreview from '@/components/Canvas/CanvasObjects/InsertPreview';
import Path from '@/components/Canvas/CanvasObjects/Objects/Path';

import { useOthersMapped } from '@/liveblocks.config';

/* What everyone else is in the middle of drawing: a pen stroke that has not
   been let go of yet, or a shape still being dragged out. */
const Drafts: React.FC = (): JSX.Element => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
      penWidth: other.presence.penWidth,
      penOpacity: other.presence.penOpacity,
      draft: other.presence.draft,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => (
        <React.Fragment key={key}>
          {other.pencilDraft && (
            <Path
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : '#000'}
              strokeWidth={other.penWidth ?? undefined}
              opacity={(other.penOpacity ?? 100) / 100}
            />
          )}
          {other.draft && (
            <InsertPreview
              layerType={other.draft.layerType}
              origin={other.draft.origin}
              current={other.draft.current}
              style={other.draft.style}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};
export default Drafts;
