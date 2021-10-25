import { themeVars } from '$lib/styles/themes/theme.css';
import { spacing12, spacingPx } from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  marginTop: [spacing12],
  marginBottom: [spacing12],
});

export const content = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  borderColor: themeVars.colour.secondary,
  boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
  backgroundColor: themeVars.colour.accent,
  color: themeVars.colour.alternative,
});
