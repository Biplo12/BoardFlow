'use client';

import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import { Link2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps['side'];
  sideOffset?: DropdownMenuContentProps['sideOffset'];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) => {
  const onCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/board/${id}`);
    toast.success('Link copied to clipboard');
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className='w-60'
      >
        <DropdownMenuItem onClick={onCopyLink} className='cursor-pointer p-3'>
          <Link2 className='mr-2 h-4 w-4' />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem className='cursor-pointer p-3'>
          <Pencil className='mr-2 h-4 w-4' />
          Rename
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
