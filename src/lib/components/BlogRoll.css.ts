import { spacing0 } from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

export const postSummary = style({
  marginLeft: '-1.5rem',
  marginRight: '-1.5rem',
  '@media': {
    '(min-width: 768px)': {
      marginLeft: [spacing0],
      marginRight: [spacing0],
    },
  },
});
