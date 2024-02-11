'use client';

import React, { memo } from 'react';

import Cursors from '@/components/Canvas/CursorsPresence/Partials/Cursors';

const CursorsPresence: React.FC = memo(() => {
  return <Cursors />;
});

CursorsPresence.displayName = 'CursorsPresence';

export default CursorsPresence;
