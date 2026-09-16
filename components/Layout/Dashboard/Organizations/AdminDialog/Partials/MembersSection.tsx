'use client';

import { useQuery } from 'convex/react';
import { UserMinus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import PersonAvatar from '@/components/common/PersonAvatar';
import SectionHeading from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/SectionHeading';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface MembersSectionProps {
  orgId: Id<'organizations'>;
}

const MembersSection: React.FC<MembersSectionProps> = ({
  orgId,
}): JSX.Element => {
  const members = useQuery(api.organizations.members, { orgId });

  const { mutate: setRole } = useApiMutation(api.organizations.setMemberRole);
  const { mutate: removeMember } = useApiMutation(
    api.organizations.removeMember
  );

  /* Removing somebody is one click away, so the button asks once first. */
  const [confirming, setConfirming] = useState<string | null>(null);

  const run = async (work: Promise<unknown>, done: string) => {
    try {
      await work;
      toast.success(done);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'That did not work');
    }
  };

  return (
    <section className='flex flex-col gap-3'>
      <SectionHeading
        label='Members'
        count={members?.length}
        hint='Admins can invite, rename boards and manage this panel.'
      />

      <ul className='flex flex-col gap-1'>
        {members?.map((member) => {
          const editable =
            member.viewerIsAdmin && !member.isOwner && !member.isSelf;

          return (
            <li
              key={member._id}
              className='flex items-center gap-3 rounded-[14px] px-1 py-2'
            >
              <PersonAvatar seed={member.userId} className='h-9 w-9' />
              <span className='min-w-0 flex-1'>
                <span
                  className='block truncate text-[15px] font-semibold'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  {member.name}
                </span>
                {member.email && (
                  <span
                    className='block truncate text-[13px] font-medium'
                    style={{ color: 'var(--candy-muted)' }}
                  >
                    {member.email}
                  </span>
                )}
              </span>

              {editable ? (
                <button
                  onClick={() =>
                    void run(
                      setRole({
                        orgId,
                        userId: member.userId,
                        role: member.role === 'admin' ? 'member' : 'admin',
                      }),
                      member.role === 'admin'
                        ? `${member.name} is now a member`
                        : `${member.name} is now an admin`
                    )
                  }
                  title='Change role'
                  className='rounded-full px-2.5 py-1 text-[12px] font-bold capitalize transition-transform hover:-translate-y-0.5'
                  style={{
                    backgroundColor:
                      member.role === 'admin'
                        ? 'var(--candy-pink)'
                        : 'var(--candy-surface)',
                    color: member.role === 'admin' ? '#fff' : 'var(--candy-ink)',
                  }}
                >
                  {member.role}
                </button>
              ) : (
                <span
                  className='rounded-full px-2.5 py-1 text-[12px] font-bold capitalize'
                  style={{
                    backgroundColor:
                      member.role === 'admin'
                        ? 'var(--candy-pink)'
                        : 'var(--candy-surface)',
                    color: member.role === 'admin' ? '#fff' : 'var(--candy-ink)',
                  }}
                >
                  {member.isOwner ? 'owner' : member.role}
                </span>
              )}

              {editable && (
                <button
                  onClick={() => {
                    if (confirming === member.userId) {
                      setConfirming(null);
                      void run(
                        removeMember({ orgId, userId: member.userId }),
                        `${member.name} was removed`
                      );
                      return;
                    }

                    setConfirming(member.userId);
                  }}
                  onBlur={() => setConfirming(null)}
                  aria-label={`Remove ${member.name}`}
                  className='flex h-8 shrink-0 items-center gap-1.5 rounded-[10px] border-2 px-2 text-[12px] font-bold'
                  style={{
                    borderColor:
                      confirming === member.userId
                        ? 'var(--candy-pink)'
                        : 'var(--candy-ink)',
                    color:
                      confirming === member.userId
                        ? 'var(--candy-pink)'
                        : 'var(--candy-ink)',
                  }}
                >
                  <UserMinus className='h-4 w-4' />
                  {confirming === member.userId && 'Sure?'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
export default MembersSection;
