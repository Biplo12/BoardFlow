import React from 'react';

import Cursor from '@/components/Canvas/CursorsPresence/Partials/Cursor';

import { useOthersConnectionIds } from '@/liveblocks.config';

const Cursors: React.FC = (): JSX.Element => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((id) => (
        <Cursor key={id} connectionId={id} />
      ))}
    </>
  );
};
export default Cursors;
