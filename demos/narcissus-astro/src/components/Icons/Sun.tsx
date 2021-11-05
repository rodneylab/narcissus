import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

config.autoAddCss = false;

export const Sun: FC<{}> = () => <FontAwesomeIcon icon={faSun} size="1x" />;

export { Sun as default };
