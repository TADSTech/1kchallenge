'use client';

import { motion } from 'framer-motion';
import { InputHTMLAttributes, forwardRef, useState, FocusEvent } from 'react';
import { COLORS } from '@/lib/constants';

interface TerminalInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  label?: string;
  error?: string;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ label, error, className = '', onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-cyberLime text-sm mb-2 font-mono">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {/* Terminal prompt prefix */}
          <span className="text-cyberLime/50 font-mono mr-4 select-none">$</span>
          
          {/* Input field with animated glow */}
          <motion.input
            ref={ref}
            className={`
              flex-1 
              bg-voidBlack 
              text-cyberLime 
              font-mono 
              px-4 
              py-3 
              border-2 
              border-solid 
              border-cyberLime/30
              focus:border-cyberLime
              focus:outline-none
              ${className}
            `}
            onFocus={handleFocus}
            onBlur={handleBlur}
            animate={{
              boxShadow: isFocused
                ? `0 0 10px ${COLORS.cyberLime}, 0 0 20px rgba(57, 255, 20, 0.4)`
                : '0 0 0px transparent',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            {...props}
          />
        </div>
        
        {/* Error message */}
        {error && (
          <p className="text-alertOrange text-sm mt-2 font-mono">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';
