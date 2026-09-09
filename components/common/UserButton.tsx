'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { LogOut } from 'lucide-react';
import React from 'react';

import PersonAvatar from '@/components/common/PersonAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { api } from '@/convex/_generated/api';

const UserButton: React.FC = (): JSX.Element => {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);

  const label = user?.name ?? user?.email ?? 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='rounded-[32%] outline-none focus-visible:ring-[3px] focus-visible:ring-[color:var(--candy-ink)]'>
        <PersonAvatar
          seed={user?._id ?? label}
          className='h-11 w-11 border-[3px] border-[#111111] transition-transform hover:-translate-y-0.5'
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={10}
        className='w-60 rounded-[18px] border-2 p-2'
        style={{
          borderColor: 'var(--candy-ink)',
          boxShadow: '0 4px 0 0 rgba(0,18,52,0.18)',
        }}
      >
        <div className='flex items-center gap-3 px-2 py-2.5'>
          <PersonAvatar seed={user?._id ?? label} className='h-9 w-9' />
          <div className='min-w-0'>
            <p
              className='truncate text-[15px] font-bold'
              style={{ color: 'var(--candy-ink)' }}
            >
              {label}
            </p>
            {user?.email && (
              <p
                className='truncate text-[13px] font-medium'
                style={{ color: 'var(--candy-muted)' }}
              >
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void signOut()}
          className='gap-2 rounded-[12px] px-2 py-2.5 text-[15px] font-semibold'
          style={{ color: 'var(--candy-pink)' }}
        >
          <LogOut className='h-[18px] w-[18px]' />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
