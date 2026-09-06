import Link from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

import BrandMark from '@/components/common/BrandMark';

interface LogoProps {
  href?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ href, className }): JSX.Element => {
  return (
    <Link
      href={href || '/'}
      className={cn('flex items-center gap-2', className)}
    >
      <BrandMark className='h-5 w-5' />
      <span
        className='font-display text-[15px] font-bold uppercase'
        style={{ fontStretch: '112%', letterSpacing: '0.1em' }}
      >
        BoardFlow
      </span>
    </Link>
  );
};
export default Logo;
