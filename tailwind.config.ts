import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Answer states
        'answer-correct': '#5BA55B',
        'answer-correct-hover': '#4A8F4A',
        'answer-incorrect': '#787C7E',
        'answer-incorrect-hover': '#686C6E',
        'answer-idle': '#FFFFFF',
        'answer-idle-border': '#E0E0E0',
        'answer-hover': '#F6F7F8',
        'answer-selected': '#E8E8E8',
        'answer-reveal': '#5BA55B',
        // Category colors
        'category-history': '#F9A03F',
        'category-science': '#5FA9E0',
        'category-geography': '#70B85B',
        'category-popculture': '#E55C9A',
        'category-politics': '#9D7ACF',
        // Accent colors
        'accent-primary': '#121213',
        'accent-success': '#5BA55B',
        'accent-warning': '#F9A03F',
        'accent-error': '#E55C5C',
        // Text colors
        'text-primary': '#121213',
        'text-secondary': '#787C7E',
        'text-tertiary': '#A0A0A0',
        // Border colors
        'border-default': '#E0E0E0',
        'border-light': '#F0F0F0',
        'border-strong': '#C0C0C0',
        // Background variations
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#FAFAFA',
        'bg-elevated': '#FFFFFF',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'elevated': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'badge': '20px',
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
        'container': '600px',
      },
    },
  },
  plugins: [],
} satisfies Config;
