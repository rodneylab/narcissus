import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSX } from 'react';

const HeartSolid = function HeartSolid(): JSX.Element {
  return <FontAwesomeIcon icon={faHeart} fixedWidth />;
};

export default HeartSolid;
