import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

config.autoAddCss = false;

const View: FC<{}> = function View() {
  return <FontAwesomeIcon icon={faEye} />;
};

export default View;
