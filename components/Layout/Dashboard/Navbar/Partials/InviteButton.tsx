'use client';

import { useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';
import { useOrganization } from '@/hooks/useOrganization';

import PersonAvatar from '@/components/common/PersonAvatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { api } from '@/convex/_generated/api';

const InviteButton: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();
  const [email, setEmail] = useState('');
  const { mutate, pending } = useApiMutation(api.organizations.invite);

  const members = useQuery(
    api.organizations.members,
    organization ? { orgId: organization._id } : 'skip'
  );

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!organization) return;

    try {
      await mutate({ orgId: organization._id, email });
      toast.success('Invitation created successfully');
      setEmail('');
    } catch (error) {
      toast.error('Failed to invite member');
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className='candy-button flex h-12 items-center gap-2 rounded-[18px] px-5 text-[15px] font-semibold whitespace-nowrap'
          style={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: 'var(--candy-ink)',
          }}
        >
          <Plus className='h-[18px] w-[18px]' />
          Invite members
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-[560px]'>
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
        </DialogHeader>
        <p
          className='-mt-2 text-[15px] font-medium'
          style={{ color: 'var(--candy-muted)' }}
        >
          Anyone you invite can open every board in this organization.
        </p>

        <form onSubmit={handleInvite} className='flex items-center gap-2.5'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='member@example.com'
            required
          />
          <button
            type='submit'
            disabled={pending || !email.trim()}
            className='candy-button flex h-[50px] shrink-0 items-center rounded-[14px] px-5 text-[15px] font-semibold text-white disabled:opacity-50'
            style={{ backgroundColor: 'var(--candy-pink)' }}
          >
            {pending ? 'Sending…' : 'Invite'}
          </button>
        </form>

        <div className='flex flex-col gap-1'>
          <span
            className='text-[12px] font-black tracking-[0.14em] uppercase'
            style={{ color: 'var(--candy-muted)' }}
          >
            In this organization
          </span>
          <ul className='mt-2 flex flex-col gap-1'>
            {members?.map((member) => (
              <li
                key={member._id}
                className='flex items-center gap-3 rounded-[14px] px-1 py-2'
              >
                <PersonAvatar seed={member.userId} className='h-9 w-9' />
                <span
                  className='min-w-0 flex-1 truncate text-[15px] font-semibold'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  {member.name}
                </span>
                <span
                  className='rounded-full px-2.5 py-1 text-[12px] font-bold capitalize'
                  style={{
                    backgroundColor:
                      member.role === 'admin'
                        ? 'var(--candy-pink)'
                        : 'var(--candy-surface)',
                    color:
                      member.role === 'admin' ? '#fff' : 'var(--candy-ink)',
                  }}
                >
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteButton;
