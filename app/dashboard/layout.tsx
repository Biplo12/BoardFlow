'use client';

import { Authenticated, AuthLoading } from 'convex/react';

import Loading from '@/components/auth/loading';
import BoardOpeningOverlay from '@/components/Dashbaord/BoardOpeningOverlay';
import DialogController from '@/components/Dialogs/DialogController';
import Navbar from '@/components/Layout/Dashboard/Navbar/Navbar';
import OrganizationSidebar from '@/components/Layout/Dashboard/OrganizationSidebar/OrganizationSidebar';
import Sidebar from '@/components/Layout/Dashboard/Sidebar/Sidebar';

import { OrganizationProvider } from '@/providers/organization-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <AuthLoading>
        <Loading />
      </AuthLoading>
      <Authenticated>
        <OrganizationProvider>
          <main
            className='relative h-full'
            style={{ backgroundColor: '#f2fafe' }}
          >
            <BoardOpeningOverlay />
            <Sidebar />
            <div className='relative h-full pl-16'>
              <div className='flex h-full gap-3'>
                <OrganizationSidebar />
                <DialogController />
                <div className='h-full flex-1'>
                  <Navbar />
                  {children}
                </div>
              </div>
            </div>
          </main>
        </OrganizationProvider>
      </Authenticated>
    </>
  );
}
