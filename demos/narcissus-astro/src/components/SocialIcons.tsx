import React from 'react';
import { SocialIcon } from 'react-social-icons';
import type { FC } from 'react';

const SocialIcons: FC<{
  network: string;
  width: number;
  height: number;
  fgColor: string;
  bgColor: string;
  url: string;
}> = ({ network, width, height, fgColor = 'transparent', bgColor, url }) => (
  <SocialIcon
    network={network}
    url={url}
    fgColor={fgColor}
    bgColor={bgColor}
    style={{ width, height }}
  />
);

export { SocialIcons as default };
