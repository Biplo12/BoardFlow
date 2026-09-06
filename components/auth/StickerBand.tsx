import React from 'react';

const STICKERS = [
  {
    color: 'var(--candy-butter)',
    className: 'left-[4%] bottom-[8%] h-24 w-24 rotate-[-8deg]',
    lines: 3,
  },
  {
    color: 'var(--candy-lime)',
    className:
      'left-[16%] bottom-[22%] hidden h-20 w-20 rotate-[6deg] sm:block',
    lines: 2,
  },
  {
    color: 'var(--candy-violet)',
    className: 'right-[6%] bottom-[12%] h-28 w-28 rotate-[7deg]',
    lines: 3,
  },
  {
    color: 'var(--candy-pink)',
    className:
      'right-[19%] bottom-[30%] hidden h-16 w-16 rotate-[-11deg] lg:block',
    lines: 2,
  },
  {
    color: '#ffffff',
    className: 'left-[9%] top-[12%] hidden h-20 w-20 rotate-[9deg] lg:block',
    lines: 2,
  },
  {
    color: 'var(--candy-lime)',
    className: 'right-[10%] top-[16%] hidden h-24 w-24 rotate-[-6deg] lg:block',
    lines: 3,
  },
];

const StickerBand: React.FC = (): JSX.Element => {
  return (
    <div aria-hidden className='pointer-events-none absolute inset-0'>
      {STICKERS.map((sticker) => (
        <div
          key={sticker.className}
          className={`absolute rounded-[18px] p-3 ${sticker.className}`}
          style={{ backgroundColor: sticker.color }}
        >
          <div className='flex h-full w-full flex-col justify-center gap-2'>
            {Array.from({ length: sticker.lines }).map((_, line) => (
              <span
                key={line}
                className='block h-[6px] rounded-full'
                style={{
                  backgroundColor: 'rgba(0, 18, 52, 0.16)',
                  width: line === sticker.lines - 1 ? '58%' : '100%',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default StickerBand;
