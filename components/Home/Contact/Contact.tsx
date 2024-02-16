/* eslint-disable @next/next/no-img-element */
import { Mail } from 'lucide-react';
import React from 'react';

const MAIL = 'robert.sinski@outlook.com';
const GITHUB = 'https://github.com/biplo12';
const LINKEDIN = 'https://www.linkedin.com/in/robert-si%C5%84ski/';

const GitHub = () => <img src='/svg/github.svg' alt='GitHub' className='w-6' />;
const LinkedIn = () => (
  <img src='/svg/linkedin.png' alt='LinkedIn' className='w-6' />
);

const Contact: React.FC = (): JSX.Element => {
  const medias = [
    {
      name: 'Mail',
      link: `mailto:${MAIL}`,
      icon: <Mail />,
    },
    {
      name: 'GitHub',
      link: GITHUB,
      icon: <GitHub />,
    },
    {
      name: 'LinkedIn',
      link: LINKEDIN,
      icon: <LinkedIn />,
    },
  ];

  return (
    <div className='relative flex min-h-[55vh] w-full flex-col items-center justify-center gap-2 overflow-hidden bg-black/5 px-6 text-black'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-center text-4xl font-bold' id='contact'>
          Get in touch with me.
        </h1>
        <p className='max-w-xl text-center'>
          If you have any questions, suggestions, or feedback, feel free to
          contact me. Also, if you want to contribute to the project, you are
          more than welcome.
        </p>
        <div className='flex flex-row gap-2'>
          {medias.map((media, index) => (
            <a href={media.link} target='_blank' rel='noreferrer' key={index}>
              {media.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Contact;
