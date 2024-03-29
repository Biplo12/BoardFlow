import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

interface LogoProps {
  href?: string;
}

const Logo: React.FC<LogoProps> = ({ href }): JSX.Element => {
  return (
    <Link href={href || '/'} className='flex items-center gap-1'>
      <Image
        src='/images/logo/logo-white-no-bg.png'
        alt='Logo'
        width={30}
        height={30}
      />
      <span className={cn('text-2xl font-semibold', font.className)}>
        BoardFlow
      </span>
    </Link>
  );
};
export default Logo;
