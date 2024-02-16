import {
  Hammer,
  LayoutDashboard,
  SquareUserRound,
  Timer,
  Users,
  Wallet,
} from 'lucide-react';
import React from 'react';

const About: React.FC = (): JSX.Element => {
  const features = [
    {
      icon: <LayoutDashboard />,
      label: 'Unlimited Boards',
      description:
        'Create as many boards as you want and customize them to your needs. You can use them for different projects, tasks, or anything else you need to organize.',
    },
    {
      icon: <Users />,
      label: 'Collaboration',
      description:
        'Invite your team to collaborate and work together on the same board. You can see each other`s changes in real time. It is a great way to keep everyone on the same page.',
    },
    {
      icon: <Hammer />,
      label: 'Tools',
      description:
        'Use a variety of tools to make your work easier and more efficient. You can add notes, shapes, images, and notes to your boards. You can also use a pencil to draw whatever you want.',
    },
    {
      icon: <Timer />,
      label: 'Time saving',
      description:
        'BoardFlow helps you save time and be more productive in your work. You can organize your tasks and projects in a simple and efficient way. You can also use it to plan your day and keep track of your progress.',
    },
    {
      icon: <Wallet />,
      label: 'Free and Open Source',
      description:
        'BoardFlow is free and open source, you can use it without any restrictions. You can also contribute to the project and help make it better. The source code is available on GitHub.',
    },
    {
      icon: <SquareUserRound />,
      label: 'Personal project',
      description:
        'This is a personal project that I made to help me organize my work and be more productive. I hope you find it useful too. If you have any suggestions or feedback, feel free to contact me.',
    },
  ];
  return (
    <div
      className='relative flex min-h-[70vh] w-full flex-col items-center justify-center gap-8 overflow-hidden bg-black/5 px-6 py-20 text-black'
      id='about'
    >
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-4xl font-bold'>About</h1>
        <div className='flex flex-col items-center justify-center'>
          <p className='max-w-2xl text-center'>
            BoardFlow is a free and open source project management tool that
            helps you organize your work and be more productive. It is designed
            to be simple and easy to use, so you can focus on what matters most.
          </p>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='flex w-full flex-col items-start justify-start gap-2 rounded-md border border-black/10 bg-white/10 p-6 text-black/80 sm:h-80 sm:w-80'
          >
            <div className='rounded-md bg-black p-4 text-white'>
              {feature.icon}
            </div>
            <div className='flex items-center justify-center gap-2'>
              <h2 className='text-2xl font-bold'>{feature.label}</h2>
            </div>
            <p className='max-w-72 text-sm'>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default About;
