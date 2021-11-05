import React from 'react';
import type { FC, ReactNode } from 'react';

const ExternalLink: FC<{
  'aria-label': string;
  href: string;
  children: ReactNode;
}> = ({ children, 'aria-label': ariaLabel, href }) => (
  <a aria-label={ariaLabel} href={href}>
    {children}
  </a>
);

export { ExternalLink as default };
