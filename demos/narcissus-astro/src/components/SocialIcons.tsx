import type { JSX } from 'react';
import { SocialIcon } from 'react-social-icons';

interface SocialIconsProps {
  network: string;
  width: number;
  height: number;
  fgColor?: string;
  bgColor: string;
  url: string;
}
const SocialIcons = function SocialIcons({
  network,
  width,
  height,
  fgColor,
  bgColor,
  url,
}: SocialIconsProps): JSX.Element {
  return (
    <SocialIcon
      network={network}
      url={url}
      fgColor={fgColor}
      bgColor={bgColor}
      style={{ width, height }}
    />
  );
};

SocialIcons.defaultProps = {
  fgColor: 'transparent',
};

export default SocialIcons;
