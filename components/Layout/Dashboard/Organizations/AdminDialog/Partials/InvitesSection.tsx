'use client';

import { useQuery } from 'convex/react';
import { Clock, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import SectionHeading from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/SectionHeading';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface InvitesSectionProps {
  orgId: Id<'organizations'>;
  canInvite: boolean;
}

const InvitesSection: React.FC<InvitesSectionProps> = ({
  orgId,
  canInvite,
}): JSX.Element => {
  const [email, setEmail] = useState('');

  const invited = useQuery(api.organizations.pendingInvitations, { orgId });

  const { mutate: invite, pending } = useApiMutation(api.organizations.invite);
  const { mutate: revoke } = useApiMutation(api.organizations.revokeInvitation);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await invite({ orgId, email });
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not send that one'
      );
    }
  };

  const handleRevoke = async (invitationId: Id<'invitations'>) => {
    try {
      await revoke({ invitationId });
      toast.success('Invitation withdrawn');
    } catch {
      toast.error('Could not withdraw it');
    }
  };

  return (
    <section className='flex flex-col gap-3'>
      <SectionHeading
        label='Invitations'
        count={invited?.length}
        hint='Anyone who joins can open every board in this organization.'
      />

      {canInvite && (
        <form onSubmit={handleInvite} className='flex items-center gap-2.5'>
          <input
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder='member@example.com'
            required
          />
          <button
            type='submit'
            disabled={pending || !email.trim()}
            className='candy-button flex h-[50px] shrink-0 items-center rounded-[14px] px-5 text-[15px] font-semibold text-white disabled:opacity-40'
            style={{ backgroundColor: 'var(--candy-pink)' }}
          >
            {pending ? 'Sending…' : 'Invite'}
          </button>
        </form>
      )}

      {invited?.length === 0 && (
        <p
          className='text-[14px] font-medium'
          style={{ color: 'var(--candy-muted)' }}
        >
          Nobody is waiting to join.
        </p>
      )}

      <ul className='flex flex-col gap-1'>
        {invited?.map((invitation) => (
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
            <span className='min-w-0 flex-1'>
              <span
                className='block truncate text-[15px] font-semibold'
                style={{ color: 'var(--candy-muted)' }}
              >
                {invitation.email}
              </span>
              <span
                className='block truncate text-[13px] font-medium'
                style={{ color: 'var(--candy-muted)' }}
              >
                invited by {invitation.invitedBy} as {invitation.role}
              </span>
            </span>
            {invitation.canRevoke && (
              <button
                onClick={() => void handleRevoke(invitation._id)}
                aria-label={`Withdraw the invitation to ${invitation.email}`}
                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border-2'
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
    </section>
  );
};
export default InvitesSection;
