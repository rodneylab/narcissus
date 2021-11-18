import { style } from '@vanilla-extract/css';
import { spacing12, spacing3 } from '../styles/vars/spacing.css';
import { maxWidthFull } from '../styles/vars/widths.css';

// eslint-disable-next-line import/prefer-default-export
export const container = style({
  display: 'flex',
  borderRadius: [spacing3],
  marginBottom: [spacing12],
  width: [maxWidthFull],
});
