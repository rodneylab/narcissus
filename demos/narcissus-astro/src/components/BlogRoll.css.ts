import { spacing0, spacing6 } from '../styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const postSummary = style({
  marginLeft: `${calc(spacing6).negate()}`,
  marginRight: `${calc(spacing6).negate()}`,
  '@media': {
    '(min-width: 768px)': {
      marginLeft: [spacing0],
      marginRight: [spacing0],
    },
  },
});
