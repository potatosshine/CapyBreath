import type { HTMLAttributes, ReactNode } from 'react';

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const PageContainer = ({ children, className = '', ...rest }: PageContainerProps) => (
  <div className={`ui-page-container ${className}`.trim()} {...rest}>
    {children}
  </div>
);

export default PageContainer;
