import Image from 'next/image';

const Loading: React.FC = (): JSX.Element => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Image
        src='/images/logo/logo-white.png'
        alt='Logo'
        width={75}
        height={75}
        className='animate-pulse duration-1000 ease-in-out'
      />
    </div>
  );
};
export default Loading;
