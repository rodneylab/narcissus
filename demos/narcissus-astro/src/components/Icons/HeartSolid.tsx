import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

config.autoAddCss = false;

const HeartSolid: FC<{}> = function HeartSolid() {
  return <FontAwesomeIcon icon={faHeart} />;
};

export default HeartSolid;
