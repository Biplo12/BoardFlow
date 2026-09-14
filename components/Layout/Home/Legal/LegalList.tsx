import React from 'react';

interface LegalListProps {
  items: { term: string; detail: string }[];
  accent: string;
}

const LegalList: React.FC<LegalListProps> = ({
  items,
  accent,
}): JSX.Element => {
  return (
    <ul className='flex flex-col gap-3'>
      {items.map((item) => (
        <li
          key={item.term}
          className='flex flex-col gap-1 rounded-[16px] border-2 bg-white px-5 py-4'
          style={{ borderColor: 'var(--candy-ink)' }}
        >
          <span
            className='flex items-center gap-2.5 text-[15px] font-black'
            style={{ color: 'var(--candy-ink)' }}
          >
            <span
              className='h-2.5 w-2.5 shrink-0 rounded-full'
              style={{ backgroundColor: accent }}
            />
            {item.term}
          </span>
          <span
            className='text-[15px] leading-[1.6] font-medium'
            style={{ color: 'var(--candy-ink)', opacity: 0.74 }}
          >
            {item.detail}
          </span>
        </li>
      ))}
    </ul>
  );
};
export default LegalList;
