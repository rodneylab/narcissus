import type { JSX } from 'react';
import { container, link, logo, rodneyLabText } from '$components/Layout/RodneyLabCredit.css';

const RodneyLabCredit: JSX.Element = function RodneyLabCredit() {
  return (
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
};

export default RodneyLabCredit;
