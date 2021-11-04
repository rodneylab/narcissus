import React from 'react';
import { COPYRIGHT_ENTITY } from '../../constants/entities';
import { copyrightText, footerLink } from './Footer.css';
import { content } from './Header.css';

const Footer = () => (
  <footer className={content}>
    <div className={copyrightText}>
      {' '}
      Created by{' '}
      <a
        ariaLabel="Open the Rodney Lab site"
        className={footerLink}
        href="https://rodneylab.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Rodney Lab
      </a>
      . Copyright {COPYRIGHT_ENTITY} 2021.
    </div>
  </footer>
);

export { Footer as default };
