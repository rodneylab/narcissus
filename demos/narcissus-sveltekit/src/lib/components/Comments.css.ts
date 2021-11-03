import { themeVars } from '$lib/styles/themes/theme.css';
import { fontFamilyHeading, fontWeightBold } from '$lib/styles/vars/font.css';
import {
  spacing0,
  spacing1,
  spacing12,
  spacing2,
  spacingPx,
  spacingPx2,
} from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

export const commentListItem = style({
  listStyleType: 'none',
});

export const commentContainer = style({
  marginBottom: [spacing12],
});

export const commentContent = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  width: '70%',
  borderColor: themeVars.colour.secondary,
  boxShadow: `${spacingPx2} ${spacing1} ${spacing1} ${themeVars.colour.shadow}`,
  backgroundColor: themeVars.colour.accent,
  paddingTop: spacing2,
  color: themeVars.colour.textSecondary,
  accentColor: themeVars.colour.textSecondary,
});

export const authorText = style({
  margin: [spacing0],
});

export const dateText = style({
  fontFamily: [fontFamilyHeading],
  fontWeight: [fontWeightBold],
});
