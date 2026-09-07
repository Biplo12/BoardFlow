import { MousePointer2 } from 'lucide-react';
import { Kalam } from 'next/font/google';
import React from 'react';

import { cn } from '@/lib/utils';

import BrandMark from '@/components/common/BrandMark';
import PersonAvatar from '@/components/common/PersonAvatar';

const handwriting = Kalam({ subsets: ['latin'], weight: ['400'] });

const TOOLS = 6;

const NOTES = [
  {
    text: 'Ship the beta',
    tint: 'var(--candy-butter)',
    at: 'left-[10%] top-[16%] w-[152px] rotate-[-3deg]',
  },
  {
    text: 'Who owns the docs?',
    tint: 'var(--candy-pink)',
    at: 'left-[35%] top-[46%] w-[168px] rotate-[2deg]',
    light: true,
  },
];

const PEOPLE = [
  { name: 'Tom', color: '#0f8fd6', at: 'left-[54%] top-[26%]', drift: '0s' },
  { name: 'Priya', color: '#9466e8', at: 'left-[20%] top-[68%]', drift: '-1.7s' },
  { name: 'Ada', color: '#ff3d7f', at: 'left-[76%] top-[56%]', drift: '-3.4s' },
];

const BoardMockup: React.FC = (): JSX.Element => {
  return (
    <div
      aria-hidden
      className='w-[820px] overflow-hidden rounded-[24px] border-[3px] bg-white lg:w-[980px]'
      style={{
        borderColor: 'var(--candy-ink)',
        boxShadow: '14px 16px 0 0 rgba(17,17,17,0.16)',
      }}
    >
      <div
        className='flex h-14 items-center justify-between border-b-[3px] px-4'
        style={{ borderColor: 'var(--candy-ink)' }}
      >
        <div className='flex items-center gap-2.5'>
          <BrandMark className='h-6 w-6' />
          <span
            className='text-[15px] font-bold'
            style={{ color: 'var(--candy-ink)' }}
          >
            Q3 kickoff
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex -space-x-2'>
            {[1, 4, 2].map((seed) => (
              <PersonAvatar
                key={seed}
                seed={seed}
                className='h-7 w-7 rounded-[32%] border-2 border-white'
              />
            ))}
          </div>
          <span
            className='rounded-[12px] px-3 py-1.5 text-[13px] font-semibold text-white'
            style={{ backgroundColor: 'var(--candy-pink)' }}
          >
            Share
          </span>
        </div>
      </div>

      <div
        className='relative h-[420px] lg:h-[480px]'
        style={{
          backgroundColor: '#f7fafc',
          backgroundImage:
            'radial-gradient(rgba(0,18,52,0.13) 1.4px, transparent 1.4px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className='absolute top-1/2 left-4 flex -translate-y-1/2 flex-col gap-1.5 rounded-[14px] bg-white p-1.5 shadow-sm'>
          {Array.from({ length: TOOLS }).map((_, index) => (
            <span
              key={index}
              className='block h-9 w-9 rounded-[10px]'
              style={{
                backgroundColor:
                  index === 0 ? 'rgba(0,18,52,0.10)' : 'rgba(0,18,52,0.05)',
              }}
            />
          ))}
        </div>

        <svg className='absolute inset-0 h-full w-full'>
          <rect
            x='60%'
            y='16%'
            width='150'
            height='96'
            rx='8'
            fill='none'
            stroke='#7ec242'
            strokeWidth='3'
          />
          <ellipse
            cx='72%'
            cy='74%'
            rx='74'
            ry='52'
            fill='none'
            stroke='#9466e8'
            strokeWidth='3'
          />
          <path
            d='M120 330c26-34 48 18 74-10s44 22 70-6'
            fill='none'
            stroke='rgba(0,18,52,0.55)'
            strokeWidth='4'
            strokeLinecap='round'
          />
        </svg>

        {NOTES.map((note) => (
          <div
            key={note.text}
            className={cn(
              'absolute rounded-[6px] p-3 shadow-sm',
              handwriting.className,
              note.at
            )}
            style={{ backgroundColor: note.tint }}
          >
            <span
              className='text-[17px] leading-snug'
              style={{ color: note.light ? '#fff' : 'var(--candy-ink)' }}
            >
              {note.text}
            </span>
          </div>
        ))}

        {PEOPLE.map((person) => (
          <div
            key={person.name}
            className={cn('cursor-drift absolute', person.at)}
            style={{ animationDelay: person.drift }}
          >
            <MousePointer2
              className='h-5 w-5'
              style={{ fill: person.color, color: person.color }}
            />
            <span
              className='absolute top-4 left-5 rounded-[6px] px-1.5 py-0.5 text-[12px] font-semibold text-white'
              style={{ backgroundColor: person.color }}
            >
              {person.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BoardMockup;
