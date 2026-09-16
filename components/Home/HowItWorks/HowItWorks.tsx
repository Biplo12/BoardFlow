import React from 'react';

import { cn } from '@/lib/utils';

import Peep from '@/components/common/Peep';

const STEPS = [
  {
    step: '01',
    figure: 'hands-on-hips',
    tint: 'var(--candy-butter)',
    floor: '#dfe36a',
    title: 'Make a board',
    body: 'Name it and it opens. No template picker, no wizard, nothing between you and the canvas.',
    tilt: '-rotate-[1.2deg]',
  },
  {
    step: '02',
    figure: 'blazer',
    tint: 'var(--candy-sky)',
    floor: '#a9d9f5',
    title: 'Send the link',
    body: 'Anyone in your organization lands on the same canvas, at the same spot, already able to draw.',
    tilt: 'rotate-[0.9deg]',
  },
  {
    step: '03',
    figure: 'explaining',
    tint: 'var(--candy-lime)',
    floor: '#a8cf5c',
    title: 'Draw together',
    body: 'Notes, shapes, images and freehand lines, with every cursor labelled as it moves.',
    tilt: '-rotate-[0.8deg]',
  },
] as const;

const HowItWorks: React.FC = (): JSX.Element => {
  return (
    <section id='how' className='w-full bg-white px-4 py-24 sm:px-8'>
      <div className='mx-auto max-w-[1160px]'>
        <div
          data-reveal
          className='flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'
        >
          <h2
            className='candy-display max-w-[520px] text-[38px] sm:text-[58px]'
            style={{ color: 'var(--candy-ink)' }}
          >
            Three steps, then you are drawing
          </h2>
          <p
            className='max-w-[320px] text-[17px] font-medium'
            style={{ color: 'var(--candy-muted)' }}
          >
            The whole thing takes about as long as writing the meeting title.
          </p>
        </div>

        <div className='mt-16 grid grid-cols-1 gap-6 md:grid-cols-3'>
          {STEPS.map((step, index) => (
            <div
              key={step.step}
              data-reveal
              className={cn('peep-card group relative flex flex-col', step.tilt)}
              style={
                {
                  backgroundColor: step.tint,
                  '--reveal-delay': `${index * 90}ms`,
                } as React.CSSProperties
              }
            >
              <div className='relative z-10 px-8 pt-8 pb-6'>
                <span
                  className='candy-display block text-[54px] opacity-25 transition-opacity duration-300 group-hover:opacity-50'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  {step.step}
                </span>
                <h3
                  className='mt-4 text-[26px] font-black tracking-[-0.025em]'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  {step.title}
                </h3>
                <p
                  className='mt-3 text-[16px] font-medium'
                  style={{ color: 'var(--candy-ink)', opacity: 0.7 }}
                >
                  {step.body}
                </p>
              </div>

              <div className='relative mt-auto h-[340px]'>
                <div
                  className='peep-floor absolute inset-x-0 bottom-0 h-[80px]'
                  style={{ backgroundColor: step.floor }}
                />
                <Peep
                  figure={step.figure}
                  className='peep-figure absolute bottom-[58px] left-1/2 h-[268px] w-auto'
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
