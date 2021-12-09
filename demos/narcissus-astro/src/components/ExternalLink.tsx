import type { FC } from 'react';

interface ExternalLinkProps {
  'aria-label': string;
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
