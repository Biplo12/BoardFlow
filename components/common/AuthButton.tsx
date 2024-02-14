import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

const DASHBOARD_URL = '/dashboard';

const AuthButton: React.FC = (): JSX.Element => {
  const { userId, isLoaded } = useAuth();

  return (
    <Link href={DASHBOARD_URL} className='hidden sm:block'>
      <Button disabled={!isLoaded}>
        {userId ? 'Go to Dashboard' : 'Sign in to continue'}
      </Button>
    </Link>
  );
};
export default AuthButton;
