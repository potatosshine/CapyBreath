import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import Card from '../../components/ui/Card';
import PageContainer from '../../components/ui/PageContainer';

type AuthFormCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkLabel: string;
  footerLinkTo: string;
};

const AuthFormCard = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerLinkTo,
}: AuthFormCardProps) => (
  <PageContainer className="max-w-md mt-4">
    <Card className="space-y-4">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </header>

      {children}

      <footer className="border-t pt-4 text-center text-sm">
        {footerText}{' '}
        <Link to={footerLinkTo} className="font-semibold text-capy-primary hover:underline">
          {footerLinkLabel}
        </Link>
      </footer>
    </Card>
  </PageContainer>
);

export default AuthFormCard;
