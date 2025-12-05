// Reusable button component with variants

import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'answer';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-accent-primary text-white hover:bg-opacity-90 focus:ring-accent-primary px-6 py-3 text-base',
    secondary:
      'bg-white text-text-primary border-2 border-border-default hover:bg-bg-secondary focus:ring-border-strong px-6 py-3 text-base',
    answer:
      'bg-white text-text-primary border-2 border-answer-idle-border hover:bg-answer-hover focus:ring-answer-idle-border px-4 py-3 text-left text-base min-h-[56px]',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
