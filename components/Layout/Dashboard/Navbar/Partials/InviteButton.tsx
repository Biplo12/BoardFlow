'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';

import { useOrganization } from '@/hooks/useOrganization';

import AdminDialog from '@/components/Layout/Dashboard/Organizations/AdminDialog/AdminDialog';

/* Members, roles and invitations all live in the organization panel now, so
   this is only the way in to its invitations tab. */
const InviteButton: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!organization}
        className='candy-button flex h-12 items-center gap-2 rounded-[18px] px-5 text-[15px] font-semibold whitespace-nowrap disabled:opacity-50'
        style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          color: 'var(--candy-ink)',
        }}
      >
        <Plus className='h-[18px] w-[18px]' />
        Invite members
      </button>

      {organization && (
        <AdminDialog
          organization={organization}
          open={open}
          onOpenChange={setOpen}
          defaultTab='invitations'
        />
      )}
    </>
  );
};
export default InviteButton;
