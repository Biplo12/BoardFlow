import SignInCard from '@/components/auth/SignInCard';

export default function SignInPage(): JSX.Element {
  return (
    <div className='bg-muted/30 flex min-h-screen w-full items-center justify-center p-4'>
      <SignInCard />
    </div>
  );
}
