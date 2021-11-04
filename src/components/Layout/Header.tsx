import React from 'react';
import { screenReaderText } from '../../styles/styles.css';
import { themeButton, themeButtonContainer } from './Header.css.ts';
import MoonIcon from '../Icons/Moon';
import SunIcon from '../Icons/Sun';
import {
  container,
  content,
  nav,
  navLink,
  navLinkActive,
  navList,
  navListItem,
} from './Header.css';

const Header = ({ slug }: { slug: string }) => {
  const lightThemeActive = true;
  const themeButtonText = `Switch to ${lightThemeActive ? 'dark' : 'light'} theme`;

  return (
    <header className={container}>
      <div className={themeButtonContainer}>
        <button className={themeButton}>
          <span className={screenReaderText}>{themeButtonText}</span>
          {lightThemeActive ? <MoonIcon scale={1.5} /> : <SunIcon scale={1.5} />}
        </button>
      </div>
      <div className={content}>
        <nav className={nav} ariaLabel="Site navigation">
          <ul className={navList}>
            <li className={navListItem}>
              <a className={`${navLink}${slug === '/' ? ` ${navLinkActive}` : ''}`} href="/.">
                Home
              </a>
            </li>
            <li className={navListItem}>
              <a
                className={`${navLink}${slug === '/contact' ? ` ${navLinkActive}` : ''}`}
                href="/contact"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { Header as default };
