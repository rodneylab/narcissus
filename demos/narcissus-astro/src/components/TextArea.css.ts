import { maxWidthFull } from '../styles/vars/widths.css';
import { style } from '@vanilla-extract/css';
import { spacing4, spacing5 } from '../styles/vars/spacing.css';

export const container = style({
  paddingBottom: [spacing5],
  marginRight: [spacing4],
});

export const input = style({
  width: [maxWidthFull],
});
