/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

config.autoAddCss = false;

const HeartOutline: FC<{}> = function HeartOutline() {
  return <FontAwesomeIcon icon={faHeart} />;
};

export default HeartOutline;
