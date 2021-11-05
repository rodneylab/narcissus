import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

config.autoAddCss = false;

export const Moon: FC<{}> = () => <FontAwesomeIcon icon={faMoon} />;

export { Moon as default };
