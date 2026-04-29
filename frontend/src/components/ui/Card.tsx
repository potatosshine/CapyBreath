import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  compact?: boolean;
};

const Card = ({ children, compact = false, className = '', ...rest }: CardProps) => (
  <div
    className={`ui-card ${compact ? 'ui-card--compact' : ''} ${className}`.trim()}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
