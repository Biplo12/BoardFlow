import { MousePointer2 } from 'lucide-react';
import { Kalam } from 'next/font/google';
import React from 'react';

import { cn } from '@/lib/utils';

import Peep from '@/components/common/Peep';

const handwriting = Kalam({ subsets: ['latin'], weight: ['400'] });

const BILL = [
  { label: 'People on a board', value: 'No cap' },
  { label: 'Boards', value: 'No cap' },
  { label: 'Every tool', value: 'Included' },
  { label: 'Card on file', value: 'None' },
];

const CURSORS = [
  { name: 'Priya', color: '#ffd23f', at: 'left-[8%] top-[10%]', drift: '0s' },
  { name: 'Tom', color: '#c3e776', at: 'left-[46%] top-[42%]', drift: '-1.3s' },
  { name: 'Ada', color: '#ff3d7f', at: 'left-[16%] top-[68%]', drift: '-2.6s' },
];

const About: React.FC = (): JSX.Element => {
  return (
    <section
      id='about'
      className='w-full px-4 py-24 sm:px-8'
      style={{ backgroundColor: '#f2fafe' }}
    >
      <div className='mx-auto max-w-[1160px]'>
        <h2
          className='candy-display max-w-[680px] text-[38px] sm:text-[58px]'
          style={{ color: 'var(--candy-ink)' }}
        >
          Everything a board should do
        </h2>
        <p
          className='mt-5 max-w-[520px] text-[17px] font-medium'
          style={{ color: 'var(--candy-muted)' }}
        >
          No modes to learn and no setup. Open a board and put something on it.
        </p>

        <div className='mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div
            className='peep-card group relative flex min-h-[340px] flex-col justify-end lg:col-span-2'
            style={{ backgroundColor: 'var(--candy-pink)' }}
          >
            <div className='peep-floor absolute inset-x-0 bottom-0 h-[80px] bg-[#e01f63]' />

            <div className='relative flex flex-col gap-6 px-8 pt-8 sm:flex-row sm:items-stretch sm:gap-2'>
              <div className='pb-12 sm:max-w-[46%]'>
                <h3 className='text-[28px] font-black tracking-[-0.025em] text-white'>
                  Everyone at once
                </h3>
                <p className='mt-3 text-[16px] font-medium text-white/75'>
                  Invite the team and work on one canvas together. Every change
                  lands as it happens, with no refresh and no merge step.
                </p>
              </div>

              <div className='flex flex-1 items-end justify-end gap-1 pb-7 sm:gap-3'>
                {(['arms-crossed', 'leaning', 'standing'] as const).map((figure, index) => (
                  <Peep
                    key={figure}
                    figure={figure}
                    className={cn(
                      'peep-figure-inline w-auto',
                      index === 1 ? 'h-[248px]' : 'h-[218px]'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className='hover-lift relative flex min-h-[340px] flex-col overflow-hidden rounded-[26px] p-8'
            style={{ backgroundColor: 'var(--candy-violet)' }}
          >
            <h3 className='text-[24px] font-black tracking-[-0.025em] text-white'>
              Live cursors
            </h3>
            <p className='mt-3 text-[16px] font-medium text-white/75'>
              Everyone on the board carries a labelled pointer, so you always
              know who is reaching for what.
            </p>

            <div
              className='relative mt-6 flex-1 rounded-[16px]'
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                backgroundImage:
                  'radial-gradient(rgba(255,255,255,0.34) 1.4px, transparent 1.4px)',
                backgroundSize: '20px 20px',
              }}
            >
              {CURSORS.map((cursor) => (
                <span
                  key={cursor.name}
                  className={cn('cursor-drift absolute', cursor.at)}
                  style={{ animationDelay: cursor.drift }}
                >
                  <MousePointer2
                    className='h-6 w-6'
                    style={{ fill: cursor.color, color: cursor.color }}
                  />
                  <span
                    className='absolute top-5 left-6 rounded-[7px] px-2 py-0.5 text-[12px] font-bold whitespace-nowrap'
                    style={{
                      backgroundColor: cursor.color,
                      color: 'var(--candy-ink)',
                    }}
                  >
                    {cursor.name}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div
            className='hover-lift group relative flex flex-col justify-between overflow-hidden rounded-[26px] p-8 lg:col-span-2'
            style={{ backgroundColor: 'var(--candy-lime)' }}
          >
            <div>
              <h3
                className='text-[24px] font-black tracking-[-0.025em]'
                style={{ color: 'var(--candy-ink)' }}
              >
                Put anything on the canvas
              </h3>
              <p
                className='mt-3 max-w-[420px] text-[16px] font-medium'
                style={{ color: 'var(--candy-ink)', opacity: 0.72 }}
              >
                Drop it anywhere, then drag, resize and stack it however the
                conversation goes.
              </p>
            </div>

            <div
              className='mt-9 flex flex-wrap items-center gap-x-5 gap-y-5 text-[28px] leading-none font-black tracking-[-0.02em] sm:text-[34px]'
              style={{ color: 'var(--candy-ink)' }}
            >
              <span
                className={cn(
                  'board-word rounded-[6px] px-4 py-2.5 text-[26px] shadow-sm sm:text-[30px]',
                  handwriting.className
                )}
                style={
                  {
                    backgroundColor: 'var(--candy-butter)',
                    '--tilt': '-3.5deg',
                  } as React.CSSProperties
                }
              >
                Notes
              </span>

              <span
                className='board-word'
                style={{ '--tilt': '0deg' } as React.CSSProperties}
              >
                Text
              </span>

              <span
                className='board-word rounded-[12px] border-[4px] px-4 py-2'
                style={
                  { borderColor: '#0f8fd6', '--tilt': '-2deg' } as React.CSSProperties
                }
              >
                Boxes
              </span>

              <span
                className='board-word rounded-full border-[4px] px-6 py-2.5'
                style={
                  { borderColor: '#9466e8', '--tilt': '2.5deg' } as React.CSSProperties
                }
              >
                Ellipses
              </span>

              <span
                className='board-word relative overflow-hidden rounded-[10px] border-[4px] px-4 pt-2 pb-4'
                style={
                  {
                    backgroundColor: '#d8eeff',
                    borderColor: 'var(--candy-ink)',
                    '--tilt': '-1.5deg',
                  } as React.CSSProperties
                }
              >
                <svg
                  className='absolute inset-x-0 bottom-0 h-[26px] w-full'
                  viewBox='0 0 120 26'
                  preserveAspectRatio='none'
                  aria-hidden
                >
                  <path d='M0 26l30-19 22 12 18-9 50 16z' fill='#7cc0e8' />
                </svg>
                <i className='absolute top-1.5 right-2.5 block h-3 w-3 rounded-full bg-[#ffd23f]' />
                <span className='relative'>Images</span>
              </span>

              <span
                className='board-word relative pb-4'
                style={{ '--tilt': '1.5deg' } as React.CSSProperties}
              >
                Lines
                <svg
                  className='absolute bottom-0 left-0 h-3 w-full'
                  viewBox='0 0 120 10'
                  preserveAspectRatio='none'
                  fill='none'
                  aria-hidden
                >
                  <path
                    d='M3 6c14-7 26 7 40 0s26-7 40 0 24 5 34 1'
                    stroke='var(--candy-ink)'
                    strokeWidth='4'
                    strokeLinecap='round'
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className='hover-lift flex flex-col rounded-[26px] border-[3px] bg-white p-8' style={{ borderColor: 'var(--candy-ink)' }}>
            <h3
              className='text-[24px] font-black tracking-[-0.025em]'
              style={{ color: 'var(--candy-ink)' }}
            >
              Free to use
            </h3>
            <p
              className='mt-3 text-[16px] font-medium'
              style={{ color: 'var(--candy-ink)', opacity: 0.72 }}
            >
              No plan to pick and no card to enter.
            </p>

            <ul className='mt-7 flex flex-col gap-3.5'>
              {BILL.map((row) => (
                <li
                  key={row.label}
                  className='flex items-baseline gap-3 text-[15px] font-semibold'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  <span className='opacity-70'>{row.label}</span>
                  <i
                    className='h-px flex-1 self-center'
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(to right, rgba(0,18,52,0.28) 0 4px, transparent 4px 8px)',
                    }}
                  />
                  <span>{row.value}</span>
                </li>
              ))}
            </ul>

            <div
              className='mt-auto flex items-end justify-between border-t-[3px] pt-5'
              style={{ borderColor: 'var(--candy-ink)', marginTop: '28px' }}
            >
              <span
                className='text-[13px] font-black tracking-[0.14em] uppercase'
                style={{ color: 'var(--candy-ink)', opacity: 0.55 }}
              >
                Total
              </span>
              <span
                className='candy-display text-[58px] leading-[0.8]'
                style={{ color: 'var(--candy-pink)' }}
              >
                $0
              </span>
            </div>
          </div>

          <div
            className='peep-card group relative flex min-h-[300px] flex-col justify-end lg:col-span-3'
            style={{ backgroundColor: 'var(--candy-butter)' }}
          >
            <div className='peep-floor absolute inset-x-0 bottom-0 h-[80px] bg-[#dfe36a]' />

            <div className='relative flex flex-col gap-6 px-8 pt-8 sm:flex-row sm:items-stretch'>
              <div className='pb-12 sm:max-w-[42%]'>
                <h3
                  className='text-[26px] font-black tracking-[-0.025em]'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  Boards for everything
                </h3>
                <p
                  className='mt-3 text-[16px] font-medium'
                  style={{ color: 'var(--candy-ink)', opacity: 0.72 }}
                >
                  One per project or one per idea, as many as you need. Nothing
                  is capped and nothing expires.
                </p>
              </div>

              <div className='flex flex-1 items-end justify-end gap-5 pb-7 sm:gap-12'>
                {(['walking', 'posing', 'resting'] as const).map((figure, index) => (
                  <Peep
                    key={figure}
                    figure={figure}
                    className={cn(
                      'peep-figure-inline w-auto',
                      index === 1 ? 'h-[224px]' : 'h-[198px]'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;
