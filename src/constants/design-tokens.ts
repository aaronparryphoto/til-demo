// Design System Tokens - NYT Games Inspired

export const colors = {
  // Base colors - NYT neutral palette
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F7F7',
    elevated: '#FAFAFA',
  },

  text: {
    primary: '#1A1A1A',
    secondary: '#5A5A5A',
    tertiary: '#878787',
    inverse: '#FFFFFF',
  },

  // Border and dividers
  border: {
    default: '#DFDFDF',
    light: '#EFEFEF',
    strong: '#C4C4C4',
  },

  // Answer states (inspired by Wordle)
  answer: {
    idle: '#FFFFFF',
    idleBorder: '#D3D6DA',
    hover: '#F7F7F7',
    selected: '#EFEFEF',
    correct: '#6AAA64', // Wordle green
    correctHover: '#5A9954',
    incorrect: '#787C7E', // Wordle gray
    incorrectHover: '#686C6E',
    reveal: '#538D4E', // Darker green for explanation
  },

  // Category colors (subtle, muted)
  category: {
    History: '#D4A574',
    Science: '#6FB3E0',
    Geography: '#7EBD8F',
    'Pop Culture': '#E09FB3',
    Politics: '#9D8ABF',
  },

  // Accent colors
  accent: {
    primary: '#000000',
    success: '#6AAA64',
    warning: '#C9B458', // Wordle yellow
    error: '#D94A4A',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
    heading: 'var(--font-geist-sans)',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
} as const;

export const borderRadius = {
  sm: '0.25rem',  // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem',   // 8px
  xl: '0.75rem',  // 12px
  full: '9999px',
} as const;

export const animations = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  mobile: '320px',
  tablet: '640px',
  desktop: '1024px',
} as const;

// Max width for content containers
export const maxWidth = {
  container: '680px',
} as const;
