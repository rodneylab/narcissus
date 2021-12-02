import React from 'react';
import type { FC } from 'react';
import { container, link, logo, rodneyLabText } from '$components/Layout/RodneyLabCredit.css';

const RodneyLabCredit: FC<{}> = () => (
  <div className={container}>
    A project by{' '}
    <a
      aria-label="Open the Rodney Lab site"
      href="https://rodneylab.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        alt="Rodney Lab Logo"
        className={logo}
        src="/assets/rodneylab-logo.png"
        height="16"
        width="16"
      />
    </a>
    <a
      aria-label="Open the Rodney Lab site"
      className={link}
      href="https://rodneylab.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={rodneyLabText}>RODNEY LAB</span>
    </a>
    .
  </div>
);

export { RodneyLabCredit as default };
