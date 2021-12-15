import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSX } from 'react';

const Sun = function Sun(): JSX.Element {
  return <FontAwesomeIcon icon={faSun} size="1x" />;
};

export default Sun;
