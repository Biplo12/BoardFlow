import Link from 'next/link';
import React from 'react';

import BrandMark from '@/components/common/BrandMark';

const GITHUB = 'https://github.com/Biplo12/BoardFlow';

const LINKS = [
  { name: 'How it works', href: '#how' },
  { name: 'Features', href: '#about' },
  { name: 'Questions', href: '#faq' },
];

const ACCOUNT = [
  { name: 'Log in', href: '/login' },
  { name: 'Sign up', href: '/register' },
];

const SWATCHES = ['#ff3d7f', '#9466e8', '#c3e776', '#ffd23f', '#0f8fd6'];

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer
      className='relative w-full overflow-hidden px-4 pt-20 sm:px-8'
      style={{ backgroundColor: 'var(--candy-ink)' }}
    >
      <span
        aria-hidden
        className='candy-display pointer-events-none absolute inset-x-0 -bottom-[1.2vw] block text-center text-[15.5vw] leading-[0.74] whitespace-nowrap text-white/[0.07] select-none'
      >
        BoardFlow
      </span>

      <div className='relative mx-auto max-w-[1160px] pb-[11vw]'>
        <div className='flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <Link href='/' className='group flex items-center gap-3'>
              <BrandMark className='h-10 w-10 transition-transform duration-300 group-hover:-rotate-6' />
              <span className='text-[24px] font-black tracking-[-0.03em] text-white'>
                BoardFlow
              </span>
            </Link>
            <p className='mt-5 max-w-[300px] text-[17px] font-medium text-white/55'>
              A whiteboard your whole team can draw on at the same time.
            </p>
            <div className='swatch-row mt-7 flex items-end gap-1.5'>
              {SWATCHES.map((color) => (
                <span
                  key={color}
                  className='swatch block h-2.5 w-8 rounded-full'
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-wrap gap-x-14 gap-y-9'>
            <div>
              <span className='text-[12px] font-black tracking-[0.16em] text-white/35 uppercase'>
                Site
              </span>
              <ul className='mt-5 flex flex-col items-start gap-3'>
                {LINKS.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='nav-link text-[17px] font-semibold text-white'
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className='text-[12px] font-black tracking-[0.16em] text-white/35 uppercase'>
                Account
              </span>
              <ul className='mt-5 flex flex-col items-start gap-3'>
                {ACCOUNT.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='nav-link text-[17px] font-semibold text-white'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className='text-[12px] font-black tracking-[0.16em] text-white/35 uppercase'>
                Code
              </span>
              <ul className='mt-5 flex flex-col items-start gap-3'>
                <li>
                  <a
                    href={GITHUB}
                    target='_blank'
                    rel='noreferrer'
                    className='nav-link text-[17px] font-semibold text-white'
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <span className='text-[17px] font-semibold text-white/40'>
                    MIT licence
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className='mt-16 flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between'
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, rgba(255,255,255,0.22) 0 6px, transparent 6px 12px)',
            backgroundSize: '100% 2px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <span className='text-[15px] font-medium text-white/45'>
            Open source, free to use
          </span>
          <span className='text-[15px] font-medium text-white/45'>
            Built on Convex and Liveblocks
          </span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
