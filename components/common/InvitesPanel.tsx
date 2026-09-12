'use client';

import { useQuery } from 'convex/react';
import { Check, MailOpen, X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface InvitesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvitesPanel: React.FC<InvitesPanelProps> = ({
  open,
  onOpenChange,
}): JSX.Element => {
  const invitations = useQuery(api.organizations.myInvitations);

  const { mutate: accept, pending: accepting } = useApiMutation(
    api.organizations.acceptMyInvitation
  );
  const { mutate: decline, pending: declining } = useApiMutation(
    api.organizations.declineMyInvitation
  );

  const busy = accepting || declining;

  const handleAccept = async (
    invitationId: Id<'invitations'>,
    organization: string
  ) => {
    try {
      await accept({ invitationId });
      toast.success(`You joined ${organization}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not join that team'
      );
    }
  };

  const handleDecline = async (invitationId: Id<'invitations'>) => {
    try {
      await decline({ invitationId });
      toast.success('Invitation declined');
    } catch {
      toast.error('Could not decline that invitation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[560px]'>
        <DialogHeader>
          <DialogTitle>Invitations</DialogTitle>
        </DialogHeader>

        <p
          className='-mt-2 text-[15px] font-medium'
          style={{ color: 'var(--candy-muted)' }}
        >
          Teams that asked you to join. Accepting puts every board in that
          organization on your dashboard.
        </p>

        {invitations === undefined && (
          <div className='mt-5 flex flex-col gap-3'>
            {[0, 1].map((row) => (
              <div
                key={row}
                className='h-[68px] animate-pulse rounded-[16px]'
                style={{ backgroundColor: 'var(--candy-surface)' }}
              />
            ))}
          </div>
        )}

        {invitations?.length === 0 && (
          <div
            className='mt-5 flex flex-col items-center gap-3 rounded-[18px] border-2 border-dashed px-6 py-10 text-center'
            style={{ borderColor: 'rgba(0,18,52,0.18)' }}
          >
            <MailOpen
              className='h-7 w-7'
              style={{ color: 'var(--candy-muted)' }}
            />
            <p
              className='text-[15px] font-semibold'
              style={{ color: 'var(--candy-muted)' }}
            >
              Nothing waiting for you right now.
            </p>
          </div>
        )}

        <ul className='-mr-1 mt-5 flex max-h-[52vh] flex-col gap-3 overflow-y-auto pr-1'>
          {invitations?.map((invitation) => (
            <li
              key={invitation._id}
              className='flex flex-wrap items-center gap-3 rounded-[18px] border-2 bg-white px-4 py-3.5'
              style={{ borderColor: 'var(--candy-ink)' }}
            >
              <div className='min-w-0 flex-1'>
                <p
                  className='truncate text-[16px] font-bold'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  {invitation.organization}
                </p>
                <p
                  className='truncate text-[13px] font-medium'
                  style={{ color: 'var(--candy-muted)' }}
                >
                  {invitation.invitedBy} invited you as {invitation.role}
                </p>
                {!invitation.canAccept && (
                  <p
                    className='mt-1 text-[13px] font-semibold'
                    style={{ color: 'var(--candy-pink)' }}
                  >
                    Confirm your email address to join.
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <button
                  onClick={() => void handleDecline(invitation._id)}
                  disabled={busy}
                  aria-label={`Decline ${invitation.organization}`}
                  className='flex h-10 w-10 items-center justify-center rounded-[12px] border-2 disabled:opacity-50'
                  style={{
                    borderColor: 'var(--candy-ink)',
                    color: 'var(--candy-ink)',
                  }}
                >
                  <X className='h-[18px] w-[18px]' />
                </button>
                <button
                  onClick={() =>
                    void handleAccept(invitation._id, invitation.organization)
                  }
                  disabled={busy || !invitation.canAccept}
                  className='candy-button flex h-10 items-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold text-white disabled:opacity-50'
                  style={{ backgroundColor: 'var(--candy-pink)' }}
                >
                  <Check className='h-[18px] w-[18px]' />
                  Join
                </button>
              </div>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
export default InvitesPanel;
