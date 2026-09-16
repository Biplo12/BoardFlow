import React from 'react';

import PersonAvatar from '@/components/common/PersonAvatar';
import ContactActions from '@/components/Home/Contact/Partials/ContactActions';

const Contact: React.FC = (): JSX.Element => {
  return (
    <section
      id='contact'
      className='w-full px-4 py-24 sm:px-8'
      style={{ backgroundColor: '#fff' }}
    >
      <div className='mx-auto max-w-[1160px]'>
        <div
          data-reveal
          className='flex flex-col items-center rounded-[32px] px-8 py-16 text-center sm:px-14 sm:py-20'
          style={{ backgroundColor: 'var(--candy-ink)' }}
        >
          <div className='avatar-row flex -space-x-4'>
            {[2, 0, 4, 5, 1, 6].map((seed) => (
              <PersonAvatar
                key={seed}
                seed={seed}
                className='avatar-chip h-16 w-16 border-[3px] border-[#111111]'
              />
            ))}
          </div>

          <h2 className='candy-display mt-8 max-w-[720px] text-[38px] text-white sm:text-[58px]'>
            Put your team on one surface
          </h2>
          <p className='mt-5 max-w-[460px] text-[17px] font-medium text-white/60'>
            Making your first board takes about ten seconds, and the people you
            invite need nothing but the link.
          </p>

          <ContactActions />
        </div>
      </div>
    </section>
  );
};
export default Contact;
