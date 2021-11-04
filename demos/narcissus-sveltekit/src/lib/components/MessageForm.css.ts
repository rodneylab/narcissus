import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize3, fontWeightBlack } from '$lib/styles/vars/font.css';
import {
  spacing1,
  spacing12,
  spacing3,
  spacing4,
  spacing5,
  spacing8,
  spacingPx,
  spacingPx2,
} from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  marginTop: [spacing12],
  marginBottom: [spacing12],
});

export const content = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  borderColor: themeVars.colour.secondary,
  boxShadow: `${spacingPx2} ${spacing1} ${spacing1} ${themeVars.colour.shadow}`,
  backgroundColor: themeVars.colour.accent,
  color: themeVars.colour.textSecondary,
  accentColor: themeVars.colour.textSecondary,
});

export const heading = style({
  fontSize: [fontSize3],
  textAlign: 'center',
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: [maxWidthFull],
});

export const formField = style({
  width: '100%',
  margin: 0,
});

export const disclaimer = style({});

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
