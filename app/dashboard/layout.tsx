import DialogController from '@/components/Dialogs/DialogController';
import Navbar from '@/components/Layout/Dashboard/Navbar/Navbar';
import OrganizationSidebar from '@/components/Layout/Dashboard/OrganizationSidebar/OrganizationSidebar';
import Sidebar from '@/components/Layout/Dashboard/Sidebar/Sidebar';

import { ConvexClientProvider } from '@/providers/convex-client-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <ConvexClientProvider>
        <main className='h-full'>
          <Sidebar />
          <div className='h-full pl-16'>
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
      </ConvexClientProvider>
    </>
  );
}
