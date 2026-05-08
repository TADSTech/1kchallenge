'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TerminalInput } from './TerminalInput';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';
import { validateRequired, validateEmail, validatePassword } from '@/lib/validation';
import { useAuth } from '@/lib/hooks/useAuth';
import type { RegistrationFormValues } from '@/lib/types';

interface FirebaseRegistrationFormProps {
  onRegisterSuccess: (username: string) => void;
  onRegisterError: () => void;
  onSwitchToLogin: () => void;
}

export function FirebaseRegistrationForm({
  onRegisterSuccess,
  onRegisterError,
  onSwitchToLogin,
}: FirebaseRegistrationFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const {
    register: registerUser,
  } = useAuth();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormValues>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsRegistering(true);
    
    try {
      await registerUser(
        data.email,
        data.password,
        data.username,
      );
      
      onRegisterSuccess(data.username);
      reset();
    } catch {
      onRegisterError();
    } finally {
      setIsRegistering(false);
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* Username input */}
      <TerminalInput
        id="username"
        label="Username"
        type="text"
        placeholder="Enter username"
        autoComplete="username"
        error={errors.username?.message}
        disabled={isRegistering}
        {...register('username', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Username is required';
            }
            return true;
          },
        })}
      />

      {/* Email input */}
      <TerminalInput
        id="email"
        label="Email Address"
        type="email"
        placeholder="Enter email"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isRegistering}
        {...register('email', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Email is required';
            }
            if (!validateEmail(value)) {
              return 'Invalid email format';
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
        placeholder="Choose a secure password"
        autoComplete="new-password"
        error={errors.password?.message}
        disabled={isRegistering}
        {...register('password', {
          validate: (value) => {
            if (!validateRequired(value)) {
              return 'Password is required';
            }
            if (!validatePassword(value)) {
              return 'Password must be at least 6 characters';
            }
            return true;
          },
        })}
      />

      {/* Submit button */}
      <div className="pt-6 flex flex-col gap-6">
        <MagneticButton
          type="submit"
          aria-label="Commit to challenge"
          disabled={isRegistering}
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
          {isRegistering ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin text-cyberLime/60">⟳</div>
              <span>REGISTERING...</span>
            </div>
          ) : (
            <GlitchText>COMMENCE PROTOCOL</GlitchText>
          )}
        </MagneticButton>

        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isRegistering}
          className="text-cyberLime/40 hover:text-cyberLime text-[10px] uppercase tracking-[0.3em] font-mono transition-colors text-left"
        >
          &gt; Already have an account? Login.sh
        </button>
      </div>


    </form>
  );
}

