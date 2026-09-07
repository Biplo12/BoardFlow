import React from 'react';

import Footer from '@/components/Layout/Home/Footer/Footer';
import Navbar from '@/components/Layout/Home/Navbar/Navbar';

interface MainPageLayoutProps {
  children: React.ReactNode;
}

export default function MainPageLayout({ children }: MainPageLayoutProps) {
  return (
    <main className='flex min-h-screen w-full flex-col'>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
