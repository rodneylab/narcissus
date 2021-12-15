import { faMoon } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { JSX } from 'react';

const Moon = function Moon(): JSX.Element {
  return <FontAwesomeIcon icon={faMoon} size="1x" />;
};

export default Moon;
