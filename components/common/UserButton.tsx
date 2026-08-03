'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { LogOut } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { api } from '@/convex/_generated/api';

const getInitials = (value: string) =>
  value.trim().slice(0, 2).toUpperCase() || 'U';

const UserButton: React.FC = (): JSX.Element => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);

  const label = user?.name ?? user?.email ?? 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none'>
        <Avatar className='h-9 w-9'>
          {user?.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{getInitials(label)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='truncate'>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void signOut()}
          className='text-destructive gap-2'
        >
          <LogOut className='h-4 w-4' />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
