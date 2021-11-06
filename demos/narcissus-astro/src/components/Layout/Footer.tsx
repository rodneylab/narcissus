import React from 'react';
import type { FC } from 'react';
import website from '../../configuration/website';

import { COPYRIGHT_ENTITY } from '../../constants/entities';
import ExternalLink from '../ExternalLink';
import SocialIcons from '../SocialIcons';
import {
  container,
  content,
  copyrightText,
  footerIcons,
  footerIconsList,
  footerIconsListItem,
  footerLink,
} from './Footer.css';
import RodneyLabCredit from './RodneyLabCredit';
import { ThemeProvider, useTheme } from '../../hooks/themeContext';

const Footer: FC<{}> = () => {
  const { facebookPage, githubPage, linkedinProfile, tiktokUsername, twitterUsername } = website;
  const {
    state: { theme },
  } = useTheme();
  const fgColor = theme === 'light' ? '#433633' : '#32021f';

  return (
    <footer className={container}>
      <div className={content}>
        <div className={copyrightText}>
          {' '}
          Created by{' '}
          <a
            aria-label="Open the Rodney Lab site"
            className={footerLink}
            href="https://rodneylab.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rodney Lab
          </a>
          . Copyright {COPYRIGHT_ENTITY} 2021.
        </div>
        <nav className={footerIcons} aria-label="Navigate to Rodney Lab linked social sites">
          <ul className={footerIconsList}>
            <li className={footerIconsListItem}>
              <ExternalLink
                aria-label="Go to the Rodney Lab Tik Tok Page"
                href={`https://www.tiktok.com/${tiktokUsername}`}
              >
                <SocialIcons network="tiktok" fgColor="transparent" bgColor={fgColor} />
              </ExternalLink>
            </li>
            <li className={footerIconsListItem}>
              <SocialIcons
                url={facebookPage}
                network="facebook"
                fgColor={fgColor}
                bgColor="transparent"
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialIcons
                url={`https://twitter.com/intent/user?screen_name=${twitterUsername}`}
                network="twitter"
                fgColor={fgColor}
                bgColor="transparent"
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialIcons
                url={`https://uk.linkedin.com/in/${linkedinProfile}`}
                network="linkedin"
                fgColor={fgColor}
                bgColor="transparent"
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialIcons
                url={`https://github.com/${githubPage}`}
                network="github"
                fgColor={fgColor}
                bgColor="transparent"
              />
            </li>
          </ul>
        </nav>
        <RodneyLabCredit />
      </div>
    </footer>
  );
};

// export { Footer as default };

function ThemeWrapper() {
  return (
    <ThemeProvider>
      <Footer />
    </ThemeProvider>
  );
}

export { ThemeWrapper as default };
