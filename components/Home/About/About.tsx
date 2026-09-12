import {
  Circle,
  Diamond as DiamondIcon,
  Eraser,
  Hand,
  Image as ImageIcon,
  Minus,
  MousePointer2,
  MoveRight,
  Pencil,
  Square,
  StickyNote,
  Type,
} from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import Peep from '@/components/common/Peep';

const BILL = [
  { label: 'People on a board', value: 'No cap' },
  { label: 'Boards', value: 'No cap' },
  { label: 'Every tool', value: 'Included' },
  { label: 'Card on file', value: 'None' },
];

/* The toolbar the product actually ships, in its real order with its real
   keys, shown at a size you would never see it on the canvas. */
const TOOLS = [
  { Icon: Hand, shortcut: '1' },
  { Icon: MousePointer2, shortcut: '2' },
  { Icon: Square, shortcut: '3' },
  { Icon: DiamondIcon, shortcut: '4' },
  { Icon: Circle, shortcut: '5' },
  { Icon: MoveRight, shortcut: '6' },
  { Icon: Minus, shortcut: '7' },
  { Icon: Pencil, shortcut: '8' },
  { Icon: Type, shortcut: '9' },
  { Icon: StickyNote, shortcut: '0' },
  { Icon: ImageIcon, shortcut: '' },
  { Icon: Eraser, shortcut: 'E' },
];

const ACTIVE_TOOL = 2;

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
          data-reveal
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
            data-reveal
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
            data-reveal
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
            data-reveal
            className='hover-lift group relative flex min-h-[360px] flex-col overflow-hidden rounded-[26px] p-8 lg:col-span-2'
            style={{ backgroundColor: 'var(--candy-lime)' }}
          >
            <h3
              className='text-[24px] font-black tracking-[-0.025em]'
              style={{ color: 'var(--candy-ink)' }}
            >
              Twelve tools, no menus
            </h3>
            <p
              className='mt-3 max-w-[460px] text-[16px] font-medium'
              style={{ color: 'var(--candy-ink)', opacity: 0.72 }}
            >
              The whole set sits on one strip and every one of them answers to
              a key. Pick a colour and a weight once, and the next thing you
              draw comes out the same.
            </p>

            <div className='mt-auto flex justify-center pt-12'>
              <div
                className='board-word canvas-panel flex-wrap items-center justify-center gap-1.5 p-2.5'
                style={{ '--tilt': '-1.5deg' } as React.CSSProperties}
              >
                {TOOLS.map(({ Icon, shortcut }, index) => (
                  <span key={index} className='relative'>
                    <span
                      className='flex h-11 w-11 items-center justify-center rounded-[13px]'
                      style={
                        index === ACTIVE_TOOL
                          ? {
                              backgroundColor: 'var(--candy-pink)',
                              color: '#fff',
                            }
                          : { color: 'var(--candy-ink)' }
                      }
                    >
                      <Icon className='h-[22px] w-[22px]' />
                    </span>
                    {shortcut && (
                      <span
                        className='pointer-events-none absolute right-1 bottom-0.5 text-[11px] leading-none'
                        style={{
                          color:
                            index === ACTIVE_TOOL
                              ? 'rgba(255,255,255,0.75)'
                              : 'var(--candy-muted)',
                        }}
                      >
                        {shortcut}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            data-reveal
            className='hover-lift flex flex-col rounded-[26px] border-[3px] bg-white p-8'
            style={{ borderColor: 'var(--candy-ink)' }}
          >
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
            data-reveal
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
