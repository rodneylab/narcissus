import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

config.autoAddcss = false;

export const Moon = ({ scale = 1 }: { scale: number }) => (
  <FontAwesomeIcon icon={faMoon} size={`${scale}x`} />
);

export { Moon as default };
