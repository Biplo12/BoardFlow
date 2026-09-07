import Link from 'next/link';
import React from 'react';

import BrandPattern from '@/components/common/BrandPattern';
import Peep from '@/components/common/Peep';
import BoardMockup from '@/components/Home/Hero/BoardMockup';

const Hero: React.FC = (): JSX.Element => {
  return (
    <section
      id='home'
      className='relative w-full overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28'
      style={{ backgroundColor: 'var(--candy-sky)' }}
    >
      <BrandPattern className='absolute inset-0 h-full w-full' />

      <div className='relative mx-auto flex max-w-[1400px] flex-col items-start gap-14 px-4 sm:px-8 lg:flex-row lg:items-center lg:gap-8'>
        <div className='w-full shrink-0 lg:w-[48%]'>
          <h1
            className='enter-rise candy-display text-[40px] sm:text-[52px] lg:text-[54px] xl:text-[66px]'
            style={{ color: 'var(--candy-ink)' }}
          >
            One board.
            <br />
            <span style={{ color: 'var(--candy-pink)' }}>Everyone</span> on it.
          </h1>
          <p
            className='enter-rise mt-6 max-w-[440px] text-[17px] font-medium sm:text-[19px]'
            style={
              {
                color: 'var(--candy-muted)',
                '--enter-delay': '110ms',
              } as React.CSSProperties
            }
          >
            Notes, sketches, shapes and images on a canvas that never runs out,
            with your team&apos;s cursors moving next to yours.
          </p>

          <div
            className='enter-rise mt-9 flex flex-col gap-3 sm:flex-row'
            style={{ '--enter-delay': '210ms' } as React.CSSProperties}
          >
            <Link
              href='/register'
              className='candy-button flex h-14 items-center justify-center rounded-[22px] px-8 text-[17px] font-semibold whitespace-nowrap text-white'
              style={{ backgroundColor: 'var(--candy-pink)' }}
            >
              Start a board for free
            </Link>
            <a
              href='#how'
              className='candy-button flex h-14 items-center justify-center rounded-[22px] px-8 text-[17px] font-semibold whitespace-nowrap'
              style={{
                backgroundColor: 'rgba(255,255,255,0.82)',
                color: 'var(--candy-ink)',
              }}
            >
              See how it works
            </a>
          </div>
        </div>

        <div className='relative w-full lg:w-[52%]'>
          <div
            className='enter-board -mr-[36%] sm:-mr-[26%] lg:-mr-[12%]'
            style={{ '--enter-delay': '300ms' } as React.CSSProperties}
          >
            <BoardMockup />
          </div>
          <span
            className='pointer-events-none absolute -bottom-5 left-0 hidden -translate-x-[18%] md:block lg:-translate-x-[38%]'
            style={{ '--enter-delay': '430ms' } as React.CSSProperties}
          >
            <Peep
              figure='pointing'
              className='enter-walk h-[250px] lg:h-[290px] xl:h-[330px]'
            />
          </span>
        </div>
      </div>
    </section>
  );
};
export default Hero;
