import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize2, fontSize3 } from '$lib/styles/vars/font.css';
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
  width: '60%',
  backgroundColor: themeVars.colour.accent,
  color: themeVars.colour.textSecondary,
  accentColor: themeVars.colour.textSecondary,
});

export const heading = style({
  fontSize: [fontSize3],
  textAlign: 'center',
});

export const formLink = style({
  [`${content} &`]: {
    color: themeVars.colour.textSecondary,
  },
});
