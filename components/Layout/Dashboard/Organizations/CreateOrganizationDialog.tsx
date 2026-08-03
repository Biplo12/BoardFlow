'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';
import { useOrganizationList } from '@/hooks/useOrganizationList';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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
      <DialogContent className='max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Organization name'
            required
          />
          <Button type='submit' disabled={pending || !name.trim()}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateOrganizationDialog;
