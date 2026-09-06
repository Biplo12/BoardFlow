'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const GoogleIcon = () => (
  <svg viewBox='0 0 24 24' className='h-5 w-5'>
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
      router.push('/dashboard');
    } catch (error) {
      toast.error(
        isSignIn
          ? "That email and password don't match."
          : "Couldn't create the account. Check the email and password."
      );
      console.error(error);
      setPending(null);
    }
  };

  return (
    <div
      className='rounded-[28px] p-8 sm:p-10'
      style={{ backgroundColor: '#fff', color: 'var(--candy-ink)' }}
    >
      <h1 className='candy-display text-[38px] sm:text-[46px]'>
        {isSignIn ? (
          <>
            Welcome
            <br />
            back
          </>
        ) : (
          <>
            Make your
            <br />
            first board
          </>
        )}
      </h1>
      <p
        className='mt-4 text-[16px] font-medium'
        style={{ color: 'var(--candy-muted)' }}
      >
        {isSignIn
          ? 'Your team is already drawing. Jump in.'
          : 'Free to start. No card, no setup.'}
      </p>

      <button
        type='button'
        onClick={handleGoogle}
        disabled={busy}
        className='candy-button mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-[22px] text-[17px] font-semibold disabled:opacity-60'
        style={{
          backgroundColor: 'var(--candy-surface)',
          color: 'var(--candy-ink)',
        }}
      >
        {pending !== 'google' && <GoogleIcon />}
        {pending === 'google' ? 'Opening Google…' : 'Continue with Google'}
      </button>

      <div className='my-6 flex items-center gap-4'>
        <span
          className='h-[2px] flex-1 rounded-full'
          style={{ backgroundColor: 'var(--candy-surface)' }}
        />
        <span
          className='text-[13px] font-semibold'
          style={{ color: 'var(--candy-muted)' }}
        >
          or
        </span>
        <span
          className='h-[2px] flex-1 rounded-full'
          style={{ backgroundColor: 'var(--candy-surface)' }}
        />
      </div>

      <form onSubmit={handlePassword} className='flex flex-col gap-3'>
        <input
          name='email'
          type='email'
          placeholder='Email'
          autoComplete='email'
          disabled={busy}
          required
          className='candy-field w-full'
          style={{ backgroundColor: 'var(--candy-surface)' }}
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          autoComplete={isSignIn ? 'current-password' : 'new-password'}
          disabled={busy}
          required
          className='candy-field w-full'
          style={{ backgroundColor: 'var(--candy-surface)' }}
        />
        <button
          type='submit'
          disabled={busy}
          className='candy-button mt-2 h-14 w-full rounded-[22px] text-[19px] font-semibold text-white disabled:opacity-60'
          style={{ backgroundColor: 'var(--candy-pink)' }}
        >
          {pending === 'password'
            ? 'One moment…'
            : isSignIn
              ? 'Log in'
              : 'Sign up — it’s free'}
        </button>
      </form>

      <p
        className='mt-7 text-[15px] font-medium'
        style={{ color: 'var(--candy-muted)' }}
      >
        {isSignIn ? 'New to BoardFlow? ' : 'Already have an account? '}
        <Link
          href={isSignIn ? '/register' : '/login'}
          className='font-semibold underline underline-offset-4 transition-opacity hover:opacity-60'
          style={{ color: 'var(--candy-ink)' }}
        >
          {isSignIn ? 'Sign up' : 'Log in'}
        </Link>
      </p>
    </div>
  );
};
export default SignInCard;
