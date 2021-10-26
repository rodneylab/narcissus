import { themeVars } from '$lib/styles/themes/theme.css';
import { spacing0, spacing4 } from '$lib/styles/vars/spacing.css';
import { maxWidthFull, maxWidthWrapper } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: [spacing4, spacing4],
  minHeight: '100vh',
  backgroundColor: themeVars.colour.background,
  color: themeVars.colour.text,

  '@media': {
    '(min-width: 768px)': {
      margin: [spacing0, 'auto'],
      padding: [spacing0, 'auto'],
    },
  },
});

export const main = style({
  maxWidth: [maxWidthWrapper],
  width: [maxWidthFull],
  padding: [spacing0, 'auto'],
  margin: ['auto'],
});
