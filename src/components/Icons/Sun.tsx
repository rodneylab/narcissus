import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

config.autoAddcss = false;

export const Sun = ({ scale = 1 }: { scale: number }) => (
  <FontAwesomeIcon icon={faSun} size={`${scale}x`} />
);

export { Sun as default };
