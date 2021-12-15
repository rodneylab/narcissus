import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSX } from 'react';

const HeartOutline = function HeartOutline(): JSX.Element {
  return <FontAwesomeIcon icon={faHeart} fixedWidth />;
};

export default HeartOutline;
