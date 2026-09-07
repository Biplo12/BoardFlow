import { ArrowUpRight } from 'lucide-react';
import React from 'react';

const GITHUB = 'https://github.com/Biplo12/BoardFlow';

const QUESTIONS = [
  {
    q: 'Do I need an account?',
    a: 'Yes, one account per person. You can use Google or an email and password.',
  },
  {
    q: 'Is it actually free?',
    a: 'Yes. There is no plan to pick, no card to enter and no limit on how many boards you make.',
  },
  {
    q: 'Can my whole team be on one board?',
    a: 'Yes. Everyone in the room sees the same canvas, and each person gets their own cursor and colour.',
  },
  {
    q: 'Do I have to install anything?',
    a: 'No. It runs in the browser, and anyone you invite opens the board from a link.',
  },
  {
    q: 'Can I use it on my own?',
    a: 'Yes. A board works the same with one person on it, so it is fine as a private scratchpad.',
  },
  {
    q: 'Where is the code?',
    a: 'All of it is public, and issues and pull requests are welcome.',
    link: { label: 'Biplo12/BoardFlow on GitHub', href: GITHUB },
  },
];

const Faq: React.FC = (): JSX.Element => {
  return (
    <section
      id='faq'
      className='w-full px-4 py-24 sm:px-8'
      style={{ backgroundColor: 'var(--candy-sky)' }}
    >
      <div className='mx-auto max-w-[1160px]'>
        <h2
          className='candy-display text-[38px] sm:text-[58px]'
          style={{ color: 'var(--candy-ink)' }}
        >
          Questions
        </h2>

        <div className='mt-12 grid grid-cols-1 gap-x-16 md:grid-cols-2'>
          {QUESTIONS.map((item) => (
            <div
              key={item.q}
              className='border-t py-7'
              style={{ borderColor: 'rgba(0,18,52,0.12)' }}
            >
              <h3
                className='text-[19px] font-black tracking-[-0.015em]'
                style={{ color: 'var(--candy-ink)' }}
              >
                {item.q}
              </h3>
              <p
                className='mt-2 text-[16px] font-medium'
                style={{ color: 'var(--candy-muted)' }}
              >
                {item.a}
              </p>
              {item.link && (
                <a
                  href={item.link.href}
                  target='_blank'
                  rel='noreferrer'
                  className='mt-3 inline-flex items-center gap-1.5 text-[15px] font-bold underline underline-offset-4 transition-opacity hover:opacity-60'
                  style={{ color: 'var(--candy-ink)' }}
                >
                  {item.link.label}
                  <ArrowUpRight className='h-4 w-4' />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Faq;
