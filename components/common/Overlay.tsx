import React from 'react';

/* Positioned so it stacks above the absolutely placed board image, which
   otherwise paints straight over a static sibling. */
const BoardOverlay: React.FC = (): JSX.Element => {
  return <div className='board-overlay absolute inset-0 z-10' />;
};
export default BoardOverlay;
