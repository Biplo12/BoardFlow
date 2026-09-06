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
      <button className='absolute top-1 right-1 px-3 py-2 opacity-100 transition-opacity outline-none lg:opacity-0 lg:group-hover:opacity-100'>
        <MoreHorizontal className='text-white opacity-75 transition-opacity hover:opacity-100' />
      </button>
    </Actions>
  );
};
export default MoreButton;
