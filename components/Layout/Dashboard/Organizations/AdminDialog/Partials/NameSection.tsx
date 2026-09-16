'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import SectionHeading from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/SectionHeading';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

/* The parent keys this on the name, so a rename from anywhere reseeds the
   field without an effect syncing prop into state. */
interface NameSectionProps {
  orgId: Id<'organizations'>;
  name: string;
  canEdit: boolean;
}

const NameSection: React.FC<NameSectionProps> = ({
  orgId,
  name,
  canEdit,
}): JSX.Element => {
  const [draft, setDraft] = useState(name);
  const { mutate, pending } = useApiMutation(api.organizations.rename);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await mutate({ orgId, name: draft });
      toast.success('Name updated');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not rename it'
      );
    }
  };

  return (
    <section className='flex flex-col gap-3'>
      <SectionHeading label='Name' />
      <form onSubmit={handleSubmit} className='flex items-center gap-2.5'>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!canEdit}
          maxLength={60}
          required
        />
        <button
          type='submit'
          disabled={!canEdit || pending || draft.trim() === name}
          className='candy-button flex h-[50px] shrink-0 items-center rounded-[14px] px-5 text-[15px] font-semibold text-white disabled:opacity-40'
          style={{ backgroundColor: 'var(--candy-pink)' }}
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </form>
    </section>
  );
};
export default NameSection;
