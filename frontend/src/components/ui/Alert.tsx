import type { HTMLAttributes, ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'info';

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: AlertVariant;
};

const Alert = ({ children, variant = 'info', className = '', ...rest }: AlertProps) => (
  <div className={`ui-alert ui-alert--${variant} ${className}`.trim()} {...rest}>
    {children}
  </div>
);

export default Alert;
