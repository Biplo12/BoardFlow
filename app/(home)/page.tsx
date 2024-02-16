/* eslint-disable @next/next/no-img-element */
'use client';

import About from '@/components/Home/About/About';
import Contact from '@/components/Home/Contact/Contact';
import Hero from '@/components/Home/Hero/Hero';

export default function MainPage(): JSX.Element {
  return (
    <div className='relative flex min-h-screen w-full flex-col overflow-hidden'>
      <Hero />
      <About />
      <Contact />
    </div>
  );
}
