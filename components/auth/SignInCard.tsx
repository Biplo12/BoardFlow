'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

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

const FIELD_LABEL =
  'text-muted-foreground font-display block text-[11px] font-semibold uppercase';

interface SignInCardProps {
  flow: 'signIn' | 'signUp';
}

const SignInCard: React.FC<SignInCardProps> = ({ flow }): JSX.Element => {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [pending, setPending] = useState<'google' | 'password' | null>(null);

  const isSignIn = flow === 'signIn';
  const busy = pending !== null;

  const handleGoogle = async () => {
    setPending('google');

    try {
      await signIn('google');
    } catch (error) {
      toast.error('Could not reach Google. Try again.');
      console.error(error);
      setPending(null);
    }
  };

  const handlePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.set('flow', flow);
    setPending('password');

    try {
      await signIn('password', formData);
      toast.success('Cleared. Taking you to your boards.');
      router.push('/dashboard');
    } catch (error) {
      toast.error(
        isSignIn
          ? "That email and password don't match."
          : 'That email already has an account. Sign in instead.'
      );
      console.error(error);
      setPending(null);
    }
  };

  return (
    <div className='plate w-full max-w-[420px] rounded-[14px] p-6 md:p-8'>
      <h1
        className='font-display text-foreground text-[28px] leading-[32px] font-bold md:text-[36px] md:leading-[40px]'
        style={{ fontStretch: '112%', letterSpacing: '-0.015em' }}
      >
        {isSignIn
          ? "Everyone's already on the board."
          : 'Put your whole team on one surface.'}
      </h1>
      <p className='text-muted-foreground mt-2.5 text-[15px] leading-[1.5]'>
        {isSignIn
          ? 'Sign in and your cursor joins theirs — same canvas, same second.'
          : 'Create an account, open a board, and everyone lands on the same canvas.'}
      </p>

      <Button
        variant='outline'
        className='bg-card mt-6 h-12 w-full justify-center gap-2.5 rounded-lg text-[15px]'
        onClick={handleGoogle}
        disabled={busy}
      >
        {pending === 'google' ? null : <GoogleIcon />}
        {pending === 'google' ? 'Opening Google…' : 'Continue with Google'}
      </Button>

      <div className='my-5 flex items-center gap-3'>
        <span className='bg-border h-px flex-1' />
        <span
          className='text-muted-foreground font-display text-[11px] font-semibold uppercase'
          style={{ letterSpacing: '0.1em' }}
        >
          {isSignIn ? 'Or sign in with email' : 'Or sign up with email'}
        </span>
        <span className='bg-border h-px flex-1' />
      </div>

      <form onSubmit={handlePassword} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email' className={FIELD_LABEL}>
            Email
          </label>
          <div className='field-route'>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='you@team.com'
              autoComplete='email'
              className='bg-card h-12 rounded-lg text-[15px]'
              disabled={busy}
              required
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='password' className={FIELD_LABEL}>
            Password
          </label>
          <div className='field-route'>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              className='bg-card h-12 rounded-lg text-[15px]'
              disabled={busy}
              required
            />
          </div>
          {!isSignIn && (
            <p className='text-muted-foreground text-[13px]'>
              8 characters minimum. No other rules.
            </p>
          )}
        </div>

        <Button
          type='submit'
          className={cn('h-12 w-full rounded-lg text-[15px] font-semibold')}
          disabled={busy}
        >
          {pending === 'password'
            ? isSignIn
              ? 'Signing in…'
              : 'Setting you up…'
            : isSignIn
              ? 'Sign in'
              : 'Create account'}
        </Button>
      </form>

      <p className='text-muted-foreground mt-5 text-[13px]'>
        {isSignIn ? 'First time here? ' : 'Already on BoardFlow? '}
        <Link
          href={isSignIn ? '/register' : '/login'}
          className='text-foreground font-medium underline decoration-1 underline-offset-4'
        >
          {isSignIn ? 'Create an account' : 'Sign in'}
        </Link>
      </p>
    </div>
  );
};
export default SignInCard;
