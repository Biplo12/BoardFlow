'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className='w-full max-w-md rounded-lg border bg-background p-8 shadow-sm'>
      <div className='mb-6 flex flex-col gap-1 text-center'>
        <h1 className='text-2xl font-semibold'>
          {step === 'signIn' ? 'Sign in to BoardFlow' : 'Create your account'}
        </h1>
        <p className='text-muted-foreground text-sm'>
          Collaborate on boards with your team.
        </p>
      </div>

      <div className='flex flex-col gap-2'>
        <Button variant='outline' onClick={() => void signIn('github')}>
          Continue with GitHub
        </Button>
        <Button variant='outline' onClick={() => void signIn('google')}>
          Continue with Google
        </Button>
      </div>

      <div className='my-6 flex items-center gap-3'>
        <span className='bg-border h-px flex-1' />
        <span className='text-muted-foreground text-xs'>or</span>
        <span className='bg-border h-px flex-1' />
      </div>

      <form onSubmit={handlePassword} className='flex flex-col gap-3'>
        <Input name='email' type='email' placeholder='Email' required />
        <Input
          name='password'
          type='password'
          placeholder='Password'
          required
        />
        <Button type='submit' disabled={pending}>
          {step === 'signIn' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>

      <button
        type='button'
        onClick={() => setStep(step === 'signIn' ? 'signUp' : 'signIn')}
        className='text-muted-foreground hover:text-foreground mt-3 w-full text-center text-sm'
      >
        {step === 'signIn'
          ? "Don't have an account? Sign up"
          : 'Already have an account? Sign in'}
      </button>

      <div className='my-6 flex items-center gap-3'>
        <span className='bg-border h-px flex-1' />
        <span className='text-muted-foreground text-xs'>magic link</span>
        <span className='bg-border h-px flex-1' />
      </div>

      <form onSubmit={handleMagicLink} className='flex flex-col gap-3'>
        <Input name='email' type='email' placeholder='Email' required />
        <Button type='submit' variant='secondary' disabled={pending}>
          Send sign-in link
        </Button>
      </form>
    </div>
  );
};
export default SignInCard;
