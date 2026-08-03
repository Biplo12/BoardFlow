'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import React from 'react';

import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationList } from '@/hooks/useOrganizationList';

import CreateOrganizationDialog from '@/components/Layout/Dashboard/Organizations/CreateOrganizationDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getInitials = (name: string) =>
  name.trim().slice(0, 2).toUpperCase() || 'OR';

const OrgSwitcher: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();
  const { organizations, setActive } = useOrganizationList();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='w-full max-w-[400px] justify-between bg-white'
        >
          <span className='flex items-center gap-2 truncate'>
            <Avatar className='h-6 w-6'>
              {organization?.imageUrl && (
                <AvatarImage src={organization.imageUrl} />
              )}
              <AvatarFallback className='text-[10px]'>
                {organization ? getInitials(organization.name) : 'OR'}
              </AvatarFallback>
            </Avatar>
            <span className='truncate'>
              {organization?.name ?? 'Select organization'}
            </span>
          </span>
          <ChevronsUpDown className='h-4 w-4 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[240px]'>
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org._id}
            onClick={() => setActive(org._id)}
            className='gap-2'
          >
            <Avatar className='h-6 w-6'>
              {org.imageUrl && <AvatarImage src={org.imageUrl} />}
              <AvatarFallback className='text-[10px]'>
                {getInitials(org.name)}
              </AvatarFallback>
            </Avatar>
            <span className='truncate'>{org.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <CreateOrganizationDialog>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className='gap-2'
          >
            <Plus className='h-4 w-4' />
            Create organization
          </DropdownMenuItem>
        </CreateOrganizationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default OrgSwitcher;
