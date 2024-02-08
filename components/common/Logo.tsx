import { Poppins } from 'next/font/google';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

const Logo: React.FC = (): JSX.Element => {
  return (
    <div className='flex items-center gap-2 text-white'>
      <Image
        src='/images/logo/logo-black-no-bg.png'
        alt='Logo'
        width={30}
        height={30}
      />
      <span className={cn('text-2xl font-semibold', font.className)}>
        BoardFlow
      </span>
    </div>
  );
};
export default Logo;
