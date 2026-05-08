'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TerminalInput } from './TerminalInput';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { GlitchText } from '@/components/shared/GlitchText';
import { validateRequired, validateEmail } from '@/lib/validation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import type { RegistrationFormValues } from '@/lib/types';

interface FirebaseRegistrationFormProps {
  onRegisterSuccess: (username: string) => void;
  onRegisterError: (message: string) => void;
}

export function FirebaseRegistrationForm({
  onRegisterSuccess,
  onRegisterError,
}: FirebaseRegistrationFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const {
    register: registerFirebase,
    error: firebaseError,
  } = useFirebaseAuth();

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
      await registerFirebase({
        email: data.email,
        password: generateSecurePassword(),
        username: data.username,
      });
      
      onRegisterSuccess(data.username);
      reset();
    } catch {
      onRegisterError(firebaseError || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const generateSecurePassword = (): string => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
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

      {/* Submit button */}
      <div className="pt-6">
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
              <span>AUTHENTICATING...</span>
            </div>
          ) : (
            <GlitchText>COMMENCE PROTOCOL</GlitchText>
          )}
        </MagneticButton>
      </div>

      {/* Error message */}
      {firebaseError && (
        <div className="text-alertOrange text-sm mt-2">
          {firebaseError}
        </div>
      )}
    </form>
  );
}
