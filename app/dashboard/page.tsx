'use client';

import { useSearchParams } from 'next/navigation';

import { useOrganization } from '@/hooks/useOrganization';

import BoardList from '@/components/Dashbaord/BoardList/BoardList';
import NoOrganization from '@/components/Dashbaord/NoOrganization';

export default function DashboardPage(): JSX.Element {
  const { organization } = useOrganization();
  const searchParams = useSearchParams();

  const query = {
    search: searchParams.get('search') ?? undefined,
    favorites: searchParams.get('favorites') ?? undefined,
  };

  return (
    <div className='flex h-[calc(100%-90px)] w-full flex-1 flex-col items-center justify-center gap-4 p-6'>
      {!organization ? (
        <NoOrganization />
      ) : (
        <BoardList orgId={organization._id} query={query} />
      )}
    </div>
  );
}
