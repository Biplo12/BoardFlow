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
      href={href || '/dashboard'}
      className={cn('group flex items-center gap-2.5', className)}
    >
      <BrandMark className='h-9 w-9 transition-transform duration-300 group-hover:-rotate-6' />
      <span
        className='text-[21px] font-black tracking-[-0.03em]'
        style={{ color: 'var(--candy-ink)' }}
      >
        BoardFlow
      </span>
    </Link>
  );
};
export default Logo;
