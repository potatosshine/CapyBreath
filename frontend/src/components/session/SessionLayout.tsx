import type { ReactNode } from 'react';

type SessionHeroProps = {
  title: string;
  subtitle: string;
  roundInfo?: string;
};

export const SessionHero = ({ title, subtitle, roundInfo }: SessionHeroProps) => (
  <div className="text-center mb-8">
    <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
      {title}
    </h1>
    <p className="text-lg text-white/85">{subtitle}</p>
    {roundInfo && <p className="mt-2 text-sm text-white/70">{roundInfo}</p>}
  </div>
);

type SessionPanelProps = {
  children: ReactNode;
  className?: string;
};

export const SessionPanel = ({ children, className = '' }: SessionPanelProps) => (
  <div className={`rounded-2xl bg-white/10 p-6 backdrop-blur-sm ${className}`.trim()}>
    {children}
  </div>
);

type PhaseActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'solid' | 'ghost';
  className?: string;
};

export const PhaseActionButton = ({
  children,
  onClick,
  variant = 'solid',
  className = '',
}: PhaseActionButtonProps) => {
  const variantClass =
    variant === 'ghost'
      ? 'border-2 border-white/40 bg-white/20 text-white hover:bg-white/30'
      : 'bg-white text-capy-primary hover:bg-white/90';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[44px] rounded-full px-8 py-3 font-semibold transition-all ${variantClass} ${className}`.trim()}
    >
      {children}
    </button>
  );
};
