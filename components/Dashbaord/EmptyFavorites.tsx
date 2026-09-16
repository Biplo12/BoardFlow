import React from 'react';

import Peep from '@/components/common/Peep';

const EmptyFavorites: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 text-center'>
      <Peep figure='easing' className='h-[220px]' />
      <h1
        className='candy-display text-[30px]'
        style={{ color: 'var(--candy-ink)' }}
      >
        No favorites yet
      </h1>
      <p
        className='max-w-[320px] text-[16px] font-medium'
        style={{ color: 'var(--candy-muted)' }}
      >
        Star a board and it shows up here.
      </p>
    </div>
  );
};
export default EmptyFavorites;
