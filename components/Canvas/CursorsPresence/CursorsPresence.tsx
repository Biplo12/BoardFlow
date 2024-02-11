'use client';

import React, { memo } from 'react';

import Cursors from '@/components/Canvas/CursorsPresence/Partials/Cursors';
import Drafts from '@/components/Canvas/CursorsPresence/Partials/Drafts';

const CursorsPresence: React.FC = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = 'CursorsPresence';

export default CursorsPresence;
