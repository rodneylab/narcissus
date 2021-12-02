import React, { useEffect } from 'react';
import type { FC } from 'react';
import { screenReaderText } from '$styles/styles.css';
import { themeButton, themeButtonContainer } from '$components/Layout/Header.css.ts';
import MoonIcon from '$components/Icons/Moon';
import SunIcon from '$components/Icons/Sun';
import {
  container,
  content,
  nav,
  navLink,
  navLinkActive,
  navList,
  navListItem,
  themeIcon,
} from './Header.css';
import { useTheme } from '../../hooks/themeContext';

interface HeaderProps {
  slug: string;
}

const Header: FC<HeaderProps> = function Header({ slug }) {
  const {
    dispatch,
    state: { theme },
  } = useTheme();

  const ssr = typeof window === 'undefined';

  // update theme from hook default (light) if the media query does not match default
  useEffect(() => {
    if (!ssr) {
      const userTheme = window?.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      if (userTheme !== theme) {
        dispatch();
      }
    }
  }, []);

  const lightThemeActive = theme === 'light';
  const themeButtonText = `Switch to ${lightThemeActive ? 'dark' : 'light'} theme`;

  return (
    <header className={container}>
      <div className={themeButtonContainer}>
        <button type="button" className={themeButton} onClick={() => dispatch()}>
          <span className={screenReaderText}>{themeButtonText}</span>
          <div className={themeIcon}>{lightThemeActive ? <MoonIcon /> : <SunIcon />}</div>
        </button>
      </div>
      <div className={content}>
        <nav className={nav} aria-label="Site navigation">
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

export default Header;
