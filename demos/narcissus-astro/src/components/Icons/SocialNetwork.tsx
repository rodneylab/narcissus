import React from 'react';
import type { FC } from 'react';
import { SocialIcon } from 'react-social-icons';
import { useTheme } from '../../hooks/themeContext';

const BUTTON_SIZE = 48;

interface SocialMediaIconProps {
  label?: string;
  network: string;
  rel?: string;
  target?: string;
  href: string;
}

const SocialMediaIcon: FC<SocialMediaIconProps> = function SocialMediaIcon({
  label,
  network,
  rel,
  target,
  href,
}) {
  const {
    state: { theme },
  } = useTheme();

  const bgColor = () => {
    if (network !== 'tiktok') {
      return 'transparent';
    }

    return theme === 'light' ? '#fcfdfd' : '#1d3557';
  };

  const fgColor = () => {
    if (network !== 'tiktok') {
      return theme === 'light' ? '#fcfdfd' : '#1d3557';
    }
    return 'transparent';
  };

  return (
    <SocialIcon
      label={label}
      network={network}
      rel={rel}
      style={{
        height: BUTTON_SIZE,
        width: BUTTON_SIZE,
      }}
      fgColor={fgColor()}
      bgColor={bgColor()}
      target={target}
      url={href}
    />
  );
};

SocialMediaIcon.defaultProps = {
  label: '',
  rel: 'nofollow noopener noreferrer',
  target: '_blank',
};

export default SocialMediaIcon;
