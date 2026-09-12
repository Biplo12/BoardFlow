'use client';

import { useQuery } from 'convex/react';
import { Clock, Plus, X } from 'lucide-react';
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
import { Id } from '@/convex/_generated/dataModel';

const InviteButton: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();
  const [email, setEmail] = useState('');
  const { mutate, pending } = useApiMutation(api.organizations.invite);

  const members = useQuery(
    api.organizations.members,
    organization ? { orgId: organization._id } : 'skip'
  );

  const invited = useQuery(
    api.organizations.pendingInvitations,
    organization ? { orgId: organization._id } : 'skip'
  );

  const { mutate: revoke } = useApiMutation(api.organizations.revokeInvitation);

  const handleRevoke = async (invitationId: Id<'invitations'>) => {
    try {
      await revoke({ invitationId });
      toast.success('Invitation withdrawn');
    } catch {
      toast.error('Failed to withdraw the invitation');
    }
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!organization) return;

    try {
      await mutate({ orgId: organization._id, email });
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to invite member'
      );
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

        <div className='-mr-1 flex max-h-[46vh] flex-col gap-4 overflow-y-auto pr-1'>
        <div className='flex flex-col gap-1'>
          <span
            className='text-[12px] font-black tracking-[0.14em] uppercase'
            style={{ color: 'var(--candy-muted)' }}
          >
            In this organization{members ? ` · ${members.length}` : ''}
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

        {invited && invited.length > 0 && (
          <div className='flex flex-col gap-1'>
            <span
              className='text-[12px] font-black tracking-[0.14em] uppercase'
              style={{ color: 'var(--candy-muted)' }}
            >
              Invited, not joined yet · {invited.length}
            </span>
            <ul className='mt-2 flex flex-col gap-1'>
              {invited.map((invitation) => (
                <li
                  key={invitation._id}
                  className='flex items-center gap-3 rounded-[14px] px-1 py-2'
                >
                  <span
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-[32%] border-2 border-dashed'
                    style={{ borderColor: 'rgba(0,18,52,0.3)' }}
                  >
                    <Clock
                      className='h-4 w-4'
                      style={{ color: 'var(--candy-muted)' }}
                    />
                  </span>
                  <span
                    className='min-w-0 flex-1 truncate text-[15px] font-semibold'
                    style={{ color: 'var(--candy-muted)' }}
                  >
                    {invitation.email}
                  </span>
                  {invitation.canRevoke && (
                    <button
                      onClick={() => void handleRevoke(invitation._id)}
                      aria-label={`Withdraw the invitation to ${invitation.email}`}
                      className='flex h-8 w-8 items-center justify-center rounded-[10px] border-2'
                      style={{
                        borderColor: 'var(--candy-ink)',
                        color: 'var(--candy-ink)',
                      }}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteButton;
