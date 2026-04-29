import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'ui-btn--primary',
  secondary: 'ui-btn--secondary',
  ghost: 'ui-btn--ghost',
  danger: 'ui-btn--danger',
};

const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...rest
}: ButtonProps) => (
  <button
    className={`ui-btn ${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
