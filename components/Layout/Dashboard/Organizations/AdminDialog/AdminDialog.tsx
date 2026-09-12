'use client';

import { useQuery } from 'convex/react';
import {
  LayoutGrid,
  Mail,
  Settings2,
  TriangleAlert,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

import { cn, orgTint } from '@/lib/utils';

import BoardsSection from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/BoardsSection';
import DangerSection from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/DangerSection';
import InvitesSection from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/InvitesSection';
import MembersSection from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/MembersSection';
import NameSection from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/NameSection';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

type Tab = 'general' | 'members' | 'invitations' | 'boards' | 'danger';

const TABS: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] =
  [
    { id: 'general', label: 'General', Icon: Settings2 },
    { id: 'members', label: 'Members', Icon: Users },
    { id: 'invitations', label: 'Invitations', Icon: Mail },
    { id: 'boards', label: 'Boards', Icon: LayoutGrid },
    { id: 'danger', label: 'Delete', Icon: TriangleAlert },
  ];

const getInitials = (name: string) =>
  name.trim().slice(0, 2).toUpperCase() || 'OR';

interface AdminDialogProps {
  organization: Doc<'organizations'>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminDialog: React.FC<AdminDialogProps> = ({
  organization,
  open,
  onOpenChange,
}): JSX.Element => {
  const [tab, setTab] = useState<Tab>('general');

  const viewer = useQuery(api.users.viewer);
  const members = useQuery(api.organizations.members, {
    orgId: organization._id,
  });

  const isAdmin = members?.some(
    (member) => member.isSelf && member.viewerIsAdmin
  );
  const isOwner = organization.ownerId === viewer?._id;
  const tint = orgTint(organization._id);

  const visible = TABS.filter((entry) => entry.id !== 'danger' || isOwner);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* A fixed frame with one section on show at a time: stacking every
          section made the dialog taller than the screen. */}
      <DialogContent className='flex h-[min(620px,86vh)] max-w-[880px] gap-0 overflow-hidden overflow-y-hidden p-0'>
        <nav
          className='flex w-[216px] shrink-0 flex-col gap-1 border-r-2 p-3'
          style={{
            borderColor: 'var(--candy-ink)',
            backgroundColor: 'var(--candy-surface)',
          }}
        >
          <DialogTitle
            className='mb-2 flex items-center gap-2.5 px-2 pt-2'
            style={{ fontSize: '17px', lineHeight: 1.25 }}
          >
            <span
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[12px] font-black'
              style={{ backgroundColor: tint.background, color: tint.ink }}
            >
              {getInitials(organization.name)}
            </span>
            <span className='truncate'>{organization.name}</span>
          </DialogTitle>

          {visible.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={tab === id}
              className={cn(
                'flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[15px] font-semibold transition-colors',
                tab !== id && 'hover:bg-white/70'
              )}
              style={{
                backgroundColor:
                  tab === id
                    ? id === 'danger'
                      ? 'var(--candy-pink)'
                      : 'var(--candy-ink)'
                    : undefined,
                color: tab === id ? '#fff' : 'var(--candy-ink)',
              }}
            >
              <Icon className='h-[18px] w-[18px] shrink-0' />
              {label}
            </button>
          ))}
        </nav>

        <div className='flex-1 overflow-y-auto p-7 pt-12'>
          {tab === 'general' && (
            <NameSection
              key={organization.name}
              orgId={organization._id}
              name={organization.name}
              canEdit={!!isAdmin}
            />
          )}
          {tab === 'members' && <MembersSection orgId={organization._id} />}
          {tab === 'invitations' && (
            <InvitesSection orgId={organization._id} canInvite={!!isAdmin} />
          )}
          {tab === 'boards' && <BoardsSection orgId={organization._id} />}
          {tab === 'danger' && isOwner && (
            <DangerSection
              orgId={organization._id}
              name={organization.name}
              onDeleted={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AdminDialog;
