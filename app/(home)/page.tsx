import About from '@/components/Home/About/About';
import Contact from '@/components/Home/Contact/Contact';
import Faq from '@/components/Home/Faq/Faq';
import Hero from '@/components/Home/Hero/Hero';
import HowItWorks from '@/components/Home/HowItWorks/HowItWorks';

export default function MainPage(): JSX.Element {
  return (
    <div className='relative flex w-full flex-col'>
      <Hero />
      <HowItWorks />
      <About />
      <Faq />
      <Contact />
    </div>
  );
}
