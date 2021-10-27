import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize2, fontSize3, fontWeightBlack } from '$lib/styles/vars/font.css';
import {
  spacing12,
  spacing2,
  spacing3,
  spacing4,
  spacing5,
  spacing8,
  spacingPx,
} from '$lib/styles/vars/spacing.css';
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

export const button = style({
  marginTop: [spacing8],
  marginBottom: [spacing4],
  fontWeight: [fontWeightBlack],
  paddingTop: [spacing3],
  paddingBottom: [spacing3],
  paddingLeft: [spacing5],
  paddingRight: [spacing5],
});
