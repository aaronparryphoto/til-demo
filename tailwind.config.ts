import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Answer states
        'answer-correct': '#6AAA64',
        'answer-correct-hover': '#5A9954',
        'answer-incorrect': '#787C7E',
        'answer-incorrect-hover': '#686C6E',
        'answer-idle': '#FFFFFF',
        'answer-idle-border': '#D3D6DA',
        'answer-hover': '#F7F7F7',
        'answer-selected': '#EFEFEF',
        'answer-reveal': '#538D4E',
        // Category colors
        'category-history': '#D4A574',
        'category-science': '#6FB3E0',
        'category-geography': '#7EBD8F',
        'category-popculture': '#E09FB3',
        'category-politics': '#9D8ABF',
        // Accent colors
        'accent-primary': '#000000',
        'accent-success': '#6AAA64',
        'accent-warning': '#C9B458',
        'accent-error': '#D94A4A',
        // Text colors
        'text-primary': '#1A1A1A',
        'text-secondary': '#5A5A5A',
        'text-tertiary': '#878787',
        // Border colors
        'border-default': '#DFDFDF',
        'border-light': '#EFEFEF',
        'border-strong': '#C4C4C4',
        // Background variations
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F7F7F7',
        'bg-elevated': '#FAFAFA',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        'flip': 'flip 350ms ease-in-out',
        'bounce-in': 'bounce-in 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slide-up 250ms ease-out',
        'fade-in': 'fade-in 250ms ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      maxWidth: {
        'container': '680px',
      },
    },
  },
  plugins: [],
} satisfies Config;
