import { spacing0, spacing12 } from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  margin: [spacing12, spacing0, spacing0],
  width: [maxWidthFull],
});
