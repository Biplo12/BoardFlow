import React from 'react';

export const ACCENTS = [
  'var(--candy-pink)',
  'var(--candy-violet)',
  'var(--candy-lime)',
  'var(--candy-butter)',
  '#0f8fd6',
  '#ffd23f',
];

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  /* Privacy reads as a light explainer, terms as a signed document, so the
     two pages carry different grounds and different intro cards. */
  tone?: 'sky' | 'ink';
  background?: string;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({
  title,
  updated,
  intro,
  tone = 'sky',
  background = '#f2fafe',
  children,
}): JSX.Element => {
  const inverted = tone === 'ink';

  return (
    <section
      className='w-full px-4 pt-36 pb-28 sm:px-8'
      style={{ backgroundColor: background }}
    >
      <div className='mx-auto max-w-[760px]'>
        <p
          className='text-[13px] font-black tracking-[0.14em] uppercase'
          style={{ color: 'var(--candy-muted)' }}
        >
          Last updated {updated}
        </p>
        <h1
          className='candy-display mt-3 text-[42px] sm:text-[58px]'
          style={{ color: 'var(--candy-ink)' }}
        >
          {title}
        </h1>

        <div
          className='mt-8 rounded-[22px] border-[3px] p-6 sm:p-7'
          style={{
            backgroundColor: inverted ? 'var(--candy-ink)' : 'var(--candy-sky)',
            borderColor: 'var(--candy-ink)',
            boxShadow: '0 5px 0 0 rgba(0,18,52,0.18)',
          }}
        >
          <p
            className='text-[18px] leading-[1.6] font-semibold'
            style={{ color: inverted ? '#fff' : 'var(--candy-ink)' }}
          >
            {intro}
          </p>
        </div>

        <div className='mt-10 flex items-center gap-1.5'>
          {ACCENTS.map((color) => (
            <span
              key={color}
              className='block h-2.5 w-9 rounded-full'
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className='mt-10 flex flex-col gap-12'>{children}</div>
      </div>
    </section>
  );
};
export default LegalPage;
