import React from 'react';

interface SectionHeadingProps {
  label: string;
  count?: number;
  hint?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  count,
  hint,
}): JSX.Element => {
  return (
    <div className='flex flex-col gap-0.5'>
      <span
        className='text-[12px] font-black tracking-[0.14em] uppercase'
        style={{ color: 'var(--candy-muted)' }}
      >
        {label}
        {count !== undefined ? ` · ${count}` : ''}
      </span>
      {hint && (
        <span
          className='text-[13px] font-medium'
          style={{ color: 'var(--candy-muted)' }}
        >
          {hint}
        </span>
      )}
    </div>
  );
};
export default SectionHeading;
