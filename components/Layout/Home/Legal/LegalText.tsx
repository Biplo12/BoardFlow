import React from 'react';

const LegalText: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  return (
    <p
      className='text-[16px] leading-[1.65] font-medium'
      style={{ color: 'var(--candy-ink)', opacity: 0.76 }}
    >
      {children}
    </p>
  );
};
export default LegalText;
