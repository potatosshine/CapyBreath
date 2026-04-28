import type { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}

const variantClasses = {
  default: 'border-capy-secondary/30 bg-white/90 text-capy-dark shadow-sm',
  glass: 'border-white/30 bg-white/15 text-white backdrop-blur-md shadow-xl',
};

const SectionCard = ({
  children,
  className = '',
  variant = 'default',
}: SectionCardProps) => (
  <section className={`rounded-2xl border p-6 ${variantClasses[variant]} ${className}`.trim()}>
    {children}
  </section>
);

export default SectionCard;
