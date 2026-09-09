import { MoreHorizontal } from 'lucide-react';
import React from 'react';

import { Actions } from '@/components/common/Actions';

interface MoreButtonProps {
  id: string;
  title: string;
}

const MoreButton: React.FC<MoreButtonProps> = ({ id, title }): JSX.Element => {
  return (
    <Actions id={id} title={title} side='right'>
      <button
        className='absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-[10px] border-2 bg-white opacity-100 outline-none transition hover:-translate-y-0.5 data-[state=open]:opacity-100 lg:opacity-0 lg:group-hover:opacity-100'
        style={{ borderColor: 'var(--candy-ink)' }}
      >
        <MoreHorizontal
          className='h-[18px] w-[18px]'
          style={{ color: 'var(--candy-ink)' }}
        />
      </button>
    </Actions>
  );
};
export default MoreButton;
