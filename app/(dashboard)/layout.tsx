import Navbar from '@/components/Layout/Navbar';
import OrganizationSidebar from '@/components/Layout/OrganizationSidebar';
import Sidebar from '@/components/Layout/Sidebar/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className='h-full'>
      <Sidebar />
      <div className='h-full pl-16'>
        <div className='flex h-full gap-3'>
          <OrganizationSidebar />
          <div className='h-full flex-1'>
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
