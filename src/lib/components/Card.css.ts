import { themeVars } from '$lib/styles/themes/theme.css';
import { spacing2, spacing4, spacing6, spacingPx2 } from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  width: [maxWidthFull],
});

export const content = style({
  width: '80%',
  border: [spacingPx2, 'solid', themeVars.colour.alternative],
  boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
  borderRadius: [spacing2],
  margin: [spacing6, 'auto'],
  padding: [spacing4, spacing6],
});
