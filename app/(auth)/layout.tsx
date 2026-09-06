import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div className='bg-muted/30 flex min-h-screen w-full items-center justify-center p-4'>
      {children}
    </div>
  );
}
