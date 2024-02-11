import { shallow } from '@liveblocks/client';
import React from 'react';

import { colorToCss } from '@/lib/utils';

import Path from '@/components/Canvas/CanvasObjects/Objects/Path';

import { useOthersMapped } from '@/liveblocks.config';

const Drafts: React.FC = (): JSX.Element => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : '#000'}
            />
          );
        }

        return null;
      })}
    </>
  );
};
export default Drafts;
