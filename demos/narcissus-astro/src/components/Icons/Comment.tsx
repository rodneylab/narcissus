import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSX } from 'react';

const Comment = function Comment(): JSX.Element {
  return <FontAwesomeIcon icon={faCommentAlt} />;
};

export default Comment;
