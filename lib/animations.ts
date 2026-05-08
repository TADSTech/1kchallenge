import { Variants } from 'framer-motion';

// Entrance animation variants
export const entranceVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    }
  },
};

// Glitch effect variants
export const glitchVariants: Variants = {
  initial: { 
    x: 0, 
    opacity: 1 
  },
  glitch: {
    x: [-2, 2, -2, 2, 0],
    opacity: [1, 0.8, 1, 0.8, 1],
    transition: {
      duration: 0.3,
      times: [0, 0.25, 0.5, 0.75, 1],
    }
  },
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  },
};

// Stagger item variants
export const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    }
  },
};

// Line-by-line build animation for milestone cards
export const lineByLineVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  },
};

export const lineItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    }
  },
};
