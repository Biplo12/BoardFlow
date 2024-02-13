'use client';

import { useOrganization } from '@clerk/nextjs';

import BoardList from '@/components/Dashbaord/BoardList/BoardList';
import NoOrganization from '@/components/Dashbaord/NoOrganization';

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

export default function DashboardPage({
  searchParams,
}: DashboardPageProps): JSX.Element {
  const { organization } = useOrganization();

  return (
    <div className='flex h-[calc(100%-90px)] w-full flex-1 flex-col items-center justify-center gap-4 p-6'>
      {!organization ? (
        <NoOrganization />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
}
