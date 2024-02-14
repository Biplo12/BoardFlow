import Navbar from '@/components/Layout/Home/Navbar/Navbar';

interface MainPageLayoutProps {
  children: React.ReactNode;
}

export default function MainPageLayout({ children }: MainPageLayoutProps) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <Navbar />
      {children}
    </main>
  );
}
