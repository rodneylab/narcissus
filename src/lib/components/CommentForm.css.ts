import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize3, fontWeightBlack } from '$lib/styles/vars/font.css';
import {
  spacing12,
  spacing20,
  spacing3,
  spacing4,
  spacing5,
  spacing8,
  spacingPx,
} from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  marginTop: [spacing20],
  marginBottom: [spacing12],
});

export const content = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  width: '70%',
  borderColor: themeVars.colour.secondary,
  boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
  backgroundColor: themeVars.colour.accent,
  color: themeVars.colour.textSecondary,
  accentColor: themeVars.colour.textSecondary,
});

export const heading = style({
  fontSize: [fontSize3],
  textAlign: 'center',
});

export const formLink = style({
  color: themeVars.colour.textSecondary,
});

export const buttonContainer = style({
  display: 'flex',
  width: [maxWidthFull],
});

export const button = style({
  marginTop: [spacing8],
  marginBottom: [spacing4],
  marginLeft: 'auto',
  fontWeight: [fontWeightBlack],
  paddingTop: [spacing3],
  paddingBottom: [spacing3],
  paddingLeft: [spacing5],
  paddingRight: [spacing5],
});
