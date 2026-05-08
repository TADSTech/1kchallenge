'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TerminalInput } from './TerminalInput';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';
import { validateRequired } from '@/lib/validation';
import { useAuth } from '@/lib/hooks/useAuth';
import type { LoginFormValues } from '@/lib/types';

interface FirebaseLoginFormProps {
  onLoginSuccess: () => void;
  onLoginError: () => void;
  onSwitchToSignup: () => void;
}

export function FirebaseLoginForm({
  onLoginSuccess,
  onLoginError,
  onSwitchToSignup,
}: FirebaseLoginFormProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const {
    login: loginUser,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoggingIn(true);
    
    try {
      await loginUser(
        data.identifier,
        data.password,
      );
      
      onLoginSuccess();
    } catch {
      onLoginError();
    } finally {
      setIsLoggingIn(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Identifier input (Email or Username) */}
      <TerminalInput
        id="identifier"
        label="Username / Email"
        type="text"
        placeholder="Enter username or email"
        autoComplete="username"
        error={errors.identifier?.message}
        disabled={isLoggingIn}
        {...register('identifier', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Identifier is required';
            }
            return true;
          },
        })}
      />

      {/* Password input */}
      <TerminalInput
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isLoggingIn}
        {...register('password', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Password is required';
            }
            return true;
          },
        })}
      />

      {/* Submit button */}
      <div className="pt-6 flex flex-col gap-6">
        <MagneticButton
          type="submit"
          aria-label="Login to account"
          disabled={isLoggingIn}
          className="
            bg-voidBlack 
            border-2 
            border-solid 
            border-cyberLime 
            text-cyberLime 
            font-mono 
            font-bold 
            px-10 
            py-4 
            min-h-[44px] 
            min-w-[44px]
            hover:bg-cyberLime/5
            transition-all
            duration-200
            disabled:opacity-40
            disabled:cursor-not-allowed
            uppercase
            tracking-widest
          "
        >
          {isLoggingIn ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin text-cyberLime/60">⟳</div>
              <span>AUTHENTICATING...</span>
            </div>
          ) : (
            <GlitchText>LOGIN PROTOCOL</GlitchText>
          )}
        </MagneticButton>

        <button
          type="button"
          onClick={onSwitchToSignup}
          disabled={isLoggingIn}
          className="text-cyberLime/40 hover:text-cyberLime text-[10px] uppercase tracking-[0.3em] font-mono transition-colors text-left"
        >
          &gt; New operative? Register.sh
        </button>
      </div>

    </form>
  );
}

