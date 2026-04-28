import type { ReactNode } from 'react';
import Navbar from '../Navbar';

type ShellVariant = 'content' | 'focus' | 'auth';

interface PageShellProps {
  children: ReactNode;
  variant?: ShellVariant;
  className?: string;
  showNavbar?: boolean;
}

const shellClasses: Record<ShellVariant, string> = {
  content: 'bg-gradient-to-b from-capy-light via-white to-capy-light/70',
  focus: 'bg-gradient-to-b from-capy-secondary via-capy-accent to-capy-dark',
  auth: 'bg-gradient-to-br from-capy-secondary via-capy-light to-white',
};

const PageShell = ({
  children,
  variant = 'content',
  className = '',
  showNavbar = true,
}: PageShellProps) => (
  <div className={`min-h-screen ${shellClasses[variant]} ${className}`.trim()}>
    {showNavbar && <Navbar />}
    {children}
  </div>
);

export default PageShell;
