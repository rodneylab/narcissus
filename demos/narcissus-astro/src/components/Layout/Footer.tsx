import React from 'react';
import type { FC } from 'react';
import SocialNetworkIcon from '$components/Icons/SocialNetwork';
import website from '$configuration/website';
import { COPYRIGHT_ENTITY } from '$constants/entities';
import {
  container,
  content,
  copyrightText,
  footerIcons,
  footerIconsList,
  footerIconsListItem,
  footerLink,
} from '$components/Layout/Footer.css';
import RodneyLabCredit from '$components/Layout/RodneyLabCredit';

interface FooterProps {
  slug: string;
}

const Footer: FC<FooterProps> = function Footer() {
  const { facebookPage, githubPage, linkedinProfile, tiktokUsername, twitterUsername } = website;

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
              <SocialNetworkIcon
                aria-label="Go to the Rodney Lab Tik Tok page"
                network="tiktok"
                href={`https://www.tiktok.com/${tiktokUsername}`}
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialNetworkIcon
                aria-label="Go to the Rodney Lab Facebook page"
                network="facebook"
                href={facebookPage}
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialNetworkIcon
                aria-label="Go to the Rodney Lab Twitter page"
                href={`https://twitter.com/intent/user?screen_name=${twitterUsername}`}
                network="twitter"
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialNetworkIcon
                aria-label="Go to the Rodney Lab Linked In page"
                href={`https://uk.linkedin.com/in/${linkedinProfile}`}
                network="linkedin"
              />
            </li>
            <li className={footerIconsListItem}>
              <SocialNetworkIcon
                aria-label="Go to the Rodney Lab Git Hub In page"
                href={`https://github.com/${githubPage}`}
                network="github"
              />
            </li>
          </ul>
        </nav>
        <RodneyLabCredit />
      </div>
    </footer>
  );
};

export default Footer;
