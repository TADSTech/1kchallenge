export const COLORS = {
  background: '#000000',
  cyberLime: '#39FF14',
  alertOrange: '#FF5F1F',
} as const;

export const ANIMATION = {
  crtFlickerMinInterval: 4000,  // ms
  crtFlickerMaxInterval: 8000,  // ms
  verificationDuration: 3,      // seconds
  magneticRadius: 60,           // px
  magneticMaxShift: 8,          // px
} as const;

export const BREAKPOINTS = {
  mobile: 768,  // px — single-column below this
} as const;
