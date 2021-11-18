import React from 'react';
import type { FC, ReactNode } from 'react';

interface ExternalLinkProps {
  'aria-label': string;
  children: ReactNode;
  href: string;
}

const ExternalLink: FC<ExternalLinkProps> = function ExternalLink({
  'aria-label': ariaLabel,
  children,
  href,
}) {
  return (
    <a aria-label={ariaLabel} href={href}>
      {children}
    </a>
  );
};

export default ExternalLink;
