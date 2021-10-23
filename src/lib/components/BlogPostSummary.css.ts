import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize2 } from '$lib/styles/vars/font.css';
import {
  spacing0,
  spacing1,
  spacing12,
  spacing2,
  spacing3,
  spacing4,
  spacingPx2,
} from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  width: [maxWidthFull],
  margin: [spacing12, spacing0],
});

export const content = style({
  width: '80%',
  border: [spacingPx2],
  borderRadius: [spacing3],
  margin: [spacing0, 'auto'],
  padding: [spacing4],

  selectors: {
    ['&:hover, &:focus']: {
      borderColor: themeVars.colour.text,
      backgroundColor: themeVars.colour.text,
      boxShadow: [spacing0, spacing0, spacing1, spacing0, themeVars.colour.primary],
      color: themeVars.colour.background,
    },
  },
});

export const contentHeading = style({
  margin: [spacing0, spacing2],
  selectors: {
    ['&:hover, &:focus']: {
      color: themeVars.colour.secondary,
    },
  },
});

export const contentBody = style({
  color: themeVars.colour.alternative,
  fontSize: fontSize2,
  margin: [spacing2],
  selectors: {
    ['&:hover, &:focus']: {
      color: themeVars.colour.secondary,
    },
  },
});
