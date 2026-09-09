import React from 'react';

import Peep from '@/components/common/Peep';

const EmptySearch: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-4 text-center'>
      <Peep figure='arms-crossed' className='h-[220px]' />
      <h1
        className='candy-display text-[30px]'
        style={{ color: 'var(--candy-ink)' }}
      >
        No boards found
      </h1>
      <p
        className='max-w-[320px] text-[16px] font-medium'
        style={{ color: 'var(--candy-muted)' }}
      >
        Nothing matches that search. Try another word.
      </p>
    </div>
  );
};
export default EmptySearch;
