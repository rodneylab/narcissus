import { style } from '@vanilla-extract/css';
import { themeVars } from '../styles/themes/theme.css';
import { spacing1, spacing2, spacing4, spacing6, spacingPx2 } from '../styles/vars/spacing.css';
import { maxWidthFull } from '../styles/vars/widths.css';

export const container = style({
  display: 'flex',
  width: [maxWidthFull],
});

export const content = style({
  width: '80%',
  border: [spacingPx2, 'solid', themeVars.colour.alternative],
  boxShadow: `${spacingPx2} ${spacing1} ${spacing1} ${themeVars.colour.shadow}`,
  borderRadius: [spacing2],
  margin: [spacing6, 'auto'],
  padding: [spacing4, spacing6],
});
