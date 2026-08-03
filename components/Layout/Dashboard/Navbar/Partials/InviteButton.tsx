'use client';

import { useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useApiMutation } from '@/hooks/useApiMutation';
import { useOrganization } from '@/hooks/useOrganization';

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

const InviteButton: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();
  const [email, setEmail] = useState('');
  const { mutate, pending } = useApiMutation(api.organizations.invite);

  const members = useQuery(
    api.organizations.members,
    organization ? { orgId: organization._id } : 'skip'
  );

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!organization) return;

    try {
      await mutate({ orgId: organization._id, email });
      toast.success('Invitation created successfully');
      setEmail('');
    } catch (error) {
      toast.error('Failed to invite member');
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className='flex items-center gap-2'>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='member@example.com'
            required
          />
          <Button type='submit' disabled={pending || !email.trim()}>
            Invite
          </Button>
        </form>
        <div className='flex flex-col gap-2'>
          {members?.map((member) => (
            <div
              key={member._id}
              className='flex items-center justify-between text-sm'
            >
              <span className='truncate'>{member.name}</span>
              <span className='text-muted-foreground capitalize'>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default InviteButton;
