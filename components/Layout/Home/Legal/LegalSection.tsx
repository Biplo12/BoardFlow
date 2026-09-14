import React from 'react';

interface LegalSectionProps {
  heading: string;
  accent: string;
  /* Terms are a numbered document; privacy is not. */
  index?: number;
  children: React.ReactNode;
}

const LegalSection: React.FC<LegalSectionProps> = ({
  heading,
  accent,
  index,
  children,
}): JSX.Element => {
  return (
    <section className='flex flex-col gap-4'>
      <h2
        className='flex items-center gap-3.5 text-[22px] font-black tracking-[-0.02em]'
        style={{ color: 'var(--candy-ink)' }}
      >
        {index === undefined ? (
          <span
            className='h-5 w-5 shrink-0 rounded-[7px] border-2'
            style={{ backgroundColor: accent, borderColor: 'var(--candy-ink)' }}
          />
        ) : (
          <span
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border-2 text-[15px] font-black tabular-nums'
            style={{
              backgroundColor: accent,
              borderColor: 'var(--candy-ink)',
              color: 'var(--candy-ink)',
            }}
          >
            {String(index).padStart(2, '0')}
          </span>
        )}
        {heading}
      </h2>
      <div className={index === undefined ? undefined : 'sm:pl-[50px]'}>
        <div className='flex flex-col gap-4'>{children}</div>
      </div>
    </section>
  );
};
export default LegalSection;
