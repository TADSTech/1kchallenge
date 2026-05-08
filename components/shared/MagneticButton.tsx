'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef, useState, MouseEvent } from 'react';
import { ANIMATION } from '@/lib/constants';

import { useReducedMotionFlag } from '@/lib/context/ReducedMotionContext';

interface MagneticButtonProps {
  children: ReactNode;
  radius?: number;
  maxShift?: number;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

export function MagneticButton({
  children,
  radius = ANIMATION.magneticRadius,
  maxShift = ANIMATION.magneticMaxShift,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotionFlag();

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || shouldReduceMotion) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const deltaX = e.clientX - buttonCenterX;
    const deltaY = e.clientY - buttonCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance <= radius) {
      // Calculate translation magnitude
      const magnitude = Math.min(distance / radius, 1) * maxShift;
      
      // Normalize direction and apply magnitude
      const directionX = deltaX / distance;
      const directionY = deltaY / distance;
      
      const translateX = directionX * magnitude;
      const translateY = directionY * magnitude;

      setPosition({ x: translateX, y: translateY });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
