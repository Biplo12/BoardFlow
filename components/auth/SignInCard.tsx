'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { LayoutDashboard, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GoogleIcon = () => (
  <svg viewBox='0 0 24 24' className='h-4 w-4'>
    <path
      fill='#4285F4'
      d='M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.19a5.29 5.29 0 0 1-2.3 3.47v2.88h3.72c2.18-2 3.45-4.96 3.45-8.36z'
    />
    <path
      fill='#34A853'
      d='M12 24c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.02-6.45-4.75H1.7v2.97A11.5 11.5 0 0 0 12 24z'
    />
    <path
      fill='#FBBC05'
      d='M5.55 14.68a6.9 6.9 0 0 1 0-4.36V7.35H1.7a11.5 11.5 0 0 0 0 10.3l3.85-2.97z'
    />
    <path
      fill='#EA4335'
      d='M12 4.75c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.72 1.2 15.11 0 12 0A11.5 11.5 0 0 0 1.7 7.35l3.85 2.97C6.46 6.77 9 4.75 12 4.75z'
    />
  </svg>
);

const SignInCard: React.FC = (): JSX.Element => {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [step, setStep] = useState<'signIn' | 'signUp'>('signIn');
  const [pending, setPending] = useState(false);

  const handlePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('flow', step);
    setPending(true);

    try {
      await signIn('password', formData);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Could not authenticate. Check your credentials.');
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setPending(true);

    try {
      await signIn('resend', formData);
      toast.success('Check your email for a sign-in link');
    } catch (error) {
      toast.error('Could not send sign-in link');
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className='bg-card w-full max-w-md rounded-2xl border p-8 shadow-xl shadow-black/5'>
      <div className='mb-8 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl shadow-sm'>
          <LayoutDashboard className='h-6 w-6' />
        </div>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            {step === 'signIn' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className='text-muted-foreground text-sm'>
            {step === 'signIn'
              ? 'Sign in to continue to BoardFlow'
              : 'Start collaborating on boards with your team'}
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        <Button
          variant='outline'
          className='h-11 justify-center gap-2.5'
          onClick={() => void signIn('google')}
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </div>

      <div className='my-6 flex items-center gap-3'>
        <span className='bg-border h-px flex-1' />
        <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
          or continue with email
        </span>
        <span className='bg-border h-px flex-1' />
      </div>

      <form onSubmit={handlePassword} className='flex flex-col gap-3'>
        <Input
          name='email'
          type='email'
          placeholder='Email'
          className='h-11'
          required
        />
        <Input
          name='password'
          type='password'
          placeholder='Password'
          className='h-11'
          required
        />
        <Button type='submit' className='h-11' disabled={pending}>
          {step === 'signIn' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>

      <p className='text-muted-foreground mt-4 text-center text-sm'>
        {step === 'signIn'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type='button'
          onClick={() => setStep(step === 'signIn' ? 'signUp' : 'signIn')}
          className='text-foreground font-medium underline-offset-4 hover:underline'
        >
          {step === 'signIn' ? 'Sign up' : 'Sign in'}
        </button>
      </p>

      <div className='bg-muted/40 mt-6 rounded-xl border border-dashed p-4'>
        <p className='text-muted-foreground mb-3 text-center text-xs font-medium tracking-wide uppercase'>
          Prefer a magic link?
        </p>
        <form onSubmit={handleMagicLink} className='flex flex-col gap-2.5'>
          <Input
            name='email'
            type='email'
            placeholder='you@example.com'
            className='bg-background h-11'
            required
          />
          <Button
            type='submit'
            variant='secondary'
            className='h-11 gap-2'
            disabled={pending}
          >
            <Mail className='h-4 w-4' />
            Send sign-in link
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SignInCard;
