'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';

import SectionHeading from '@/components/Layout/Dashboard/Organizations/AdminDialog/Partials/SectionHeading';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface DangerSectionProps {
  orgId: Id<'organizations'>;
  name: string;
  onDeleted: () => void;
}

/* Typing the name is the confirmation: this takes every board in the
   organization with it and there is no undo. */
const DangerSection: React.FC<DangerSectionProps> = ({
  orgId,
  name,
  onDeleted,
}): JSX.Element => {
  const [typed, setTyped] = useState('');
  const { mutate, pending } = useApiMutation(api.organizations.remove);

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await mutate({ orgId });
      toast.success(`${name} was deleted`);
      onDeleted();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not delete it'
      );
    }
  };

  return (
    <section
      className='flex flex-col gap-3 rounded-[18px] border-2 p-4'
      style={{ borderColor: 'var(--candy-pink)' }}
    >
      <SectionHeading
        label='Delete this organization'
        hint={`Every board, member and invitation goes with it. Type "${name}" to confirm.`}
      />

      <form onSubmit={handleDelete} className='flex items-center gap-2.5'>
        <input
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          placeholder={name}
          aria-label='Type the organization name to confirm'
        />
        <button
          type='submit'
          disabled={pending || typed.trim() !== name}
          className='candy-button flex h-[50px] shrink-0 items-center rounded-[14px] px-5 text-[15px] font-semibold text-white disabled:opacity-40'
          style={{ backgroundColor: 'var(--candy-pink)' }}
        >
          {pending ? 'Deleting…' : 'Delete'}
        </button>
      </form>
    </section>
  );
};
export default DangerSection;
