import React from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC } from 'react';

config.autoAddCss = false;

const Comment: FC<{}> = function Comment() {
  return <FontAwesomeIcon icon={faCommentAlt} />;
};

export default Comment;
