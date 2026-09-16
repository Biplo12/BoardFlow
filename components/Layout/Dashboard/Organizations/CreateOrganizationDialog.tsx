'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';
import { useOrganizationList } from '@/hooks/useOrganizationList';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { api } from '@/convex/_generated/api';

interface CreateOrganizationDialogProps {
  children: React.ReactNode;
}

const CreateOrganizationDialog: React.FC<CreateOrganizationDialogProps> = ({
  children,
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { mutate, pending } = useApiMutation(api.organizations.create);
  const { setActive } = useOrganizationList();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const orgId = await mutate({ name });
      setActive(orgId);
      toast.success('Organization created successfully');
      setName('');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create organization');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Organization name'
            required
          />
          <button
            type='submit'
            disabled={pending || !name.trim()}
            className='candy-button flex h-[50px] items-center justify-center rounded-[14px] text-[15px] font-semibold text-white disabled:opacity-50'
            style={{ backgroundColor: 'var(--candy-pink)' }}
          >
            {pending ? 'Creating…' : 'Create organization'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateOrganizationDialog;
