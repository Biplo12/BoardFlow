'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';
import React from 'react';

import { orgTint } from '@/lib/utils';
import { useOrganization } from '@/hooks/useOrganization';
import { useOrganizationList } from '@/hooks/useOrganizationList';

import CreateOrganizationDialog from '@/components/Layout/Dashboard/Organizations/CreateOrganizationDialog';
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

const OrgChip = ({ id, name }: { id: string; name: string }) => {
  const tint = orgTint(id);

  return (
    <span
      className='flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] text-[11px] font-black'
      style={{ backgroundColor: tint.background, color: tint.ink }}
    >
      {getInitials(name)}
    </span>
  );
};

const OrgSwitcher: React.FC = (): JSX.Element => {
  const { organization } = useOrganization();
  const { organizations, setActive } = useOrganizationList();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className='flex h-[52px] w-full max-w-[400px] items-center justify-between gap-2 rounded-[16px] border-2 bg-white px-3 text-[15px] font-semibold transition hover:-translate-y-0.5'
          style={{
            borderColor: 'var(--candy-ink)',
            boxShadow: '0 3px 0 0 rgba(0,18,52,0.16)',
            color: 'var(--candy-ink)',
          }}
        >
          <span className='flex min-w-0 items-center gap-2.5'>
            <OrgChip
              id={organization?._id ?? 'none'}
              name={organization?.name ?? 'OR'}
            />
            <span className='truncate'>
              {organization?.name ?? 'Select organization'}
            </span>
          </span>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        alignOffset={2}
        sideOffset={8}
        collisionPadding={12}
        className='w-[248px] rounded-[18px] border-2 p-2'
        style={{
          borderColor: 'var(--candy-ink)',
          boxShadow: '0 4px 0 0 rgba(0,18,52,0.18)',
        }}
      >
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org._id}
            onClick={() => setActive(org._id)}
            className='gap-2.5 rounded-[12px] px-2 py-2 text-[15px] font-semibold'
          >
            <OrgChip id={org._id} name={org.name} />
            <span className='truncate'>{org.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <CreateOrganizationDialog>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className='gap-2.5 rounded-[12px] px-2 py-2 text-[15px] font-semibold'
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
