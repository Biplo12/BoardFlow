'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { LogOut, Mail } from 'lucide-react';
import React, { useRef, useState } from 'react';

import InvitesPanel from '@/components/common/InvitesPanel';
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
  const invitations = useQuery(api.organizations.myInvitations);

  const [showInvites, setShowInvites] = useState(false);

  /* Radix hands focus back to the trigger when the menu closes, and a
     programmatic focus counts as focus-visible, so a click would leave the
     ring behind. Keyboard users still get it. */
  const openedByPointer = useRef(false);

  const label = user?.name ?? user?.email ?? 'User';
  const waiting = invitations?.length ?? 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onPointerDown={() => {
            openedByPointer.current = true;
          }}
          onKeyDown={() => {
            openedByPointer.current = false;
          }}
          className='relative rounded-[32%] outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-[color:var(--candy-ink)]'
        >
          <PersonAvatar
            seed={user?._id ?? label}
            className='h-11 w-11 border-[3px] border-[#111111]'
          />
          {waiting > 0 && (
            <span
              aria-label={`${waiting} invitation${waiting === 1 ? '' : 's'}`}
              className='absolute -top-1.5 -right-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 px-1 text-[12px] leading-none font-black text-white'
              style={{
                backgroundColor: 'var(--candy-pink)',
                borderColor: 'var(--candy-ink)',
              }}
            >
              {waiting > 9 ? '9+' : waiting}
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          sideOffset={10}
          onCloseAutoFocus={(event) => {
            if (openedByPointer.current) event.preventDefault();
          }}
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
            onSelect={(event) => {
              event.preventDefault();
              setShowInvites(true);
            }}
            className='gap-2 rounded-[12px] px-2 py-2.5 text-[15px] font-semibold'
            style={{ color: 'var(--candy-ink)' }}
          >
            <Mail className='h-[18px] w-[18px]' />
            Invitations
            {waiting > 0 && (
              <span
                className='ml-auto flex h-[20px] min-w-[20px] items-center justify-center rounded-full px-1 text-[12px] leading-none font-black text-white'
                style={{ backgroundColor: 'var(--candy-pink)' }}
              >
                {waiting}
              </span>
            )}
          </DropdownMenuItem>
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

      <InvitesPanel open={showInvites} onOpenChange={setShowInvites} />
    </>
  );
};
export default UserButton;
