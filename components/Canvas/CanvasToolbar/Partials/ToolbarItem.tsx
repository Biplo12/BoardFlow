import React from 'react';

import Hint from '@/components/common/Hint';
import { Button } from '@/components/ui/button';

interface ToolbarItemProps {
  label: string;
  Icon: React.FC;
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
      <Button
        disabled={isDisabled}
        onClick={onClick}
        size='sm'
        variant={isActive ? 'default' : 'ghost'}
      >
        <Icon />
      </Button>
    </Hint>
  );
};
export default ToolbarItem;
