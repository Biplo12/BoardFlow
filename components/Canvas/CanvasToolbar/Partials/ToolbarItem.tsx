import React from 'react';

import Hint from '@/components/common/Hint';

interface ToolbarItemProps {
  label: string;
  Icon: React.FC<{ className?: string }>;
  onClick: () => void;
  isDisabled?: boolean;
  isActive?: boolean;
}

const ToolbarItem: React.FC<ToolbarItemProps> = ({
  label,
  Icon,
  onClick,
  isDisabled,
  isActive,
}): JSX.Element => {
  return (
    <Hint label={label} side='right' sideOffset={14}>
      <button
        disabled={isDisabled}
        onClick={onClick}
        data-active={Boolean(isActive)}
        className='tool-button'
      >
        <Icon className='h-[19px] w-[19px]' />
      </button>
    </Hint>
  );
};
export default ToolbarItem;
