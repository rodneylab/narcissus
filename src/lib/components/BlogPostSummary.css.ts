import { themeVars } from '$lib/styles/themes/theme.css';
import { fontFamilyHeading, fontSize2, fontSize3 } from '$lib/styles/vars/font.css';
import {
  spacing0,
  spacing1,
  spacing12,
  spacing2,
  spacing4,
  spacingPx2,
} from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  width: [maxWidthFull],
  marginTop: [spacing12],
});

export const content = style({
  border: [spacingPx2],
  borderRadius: [spacing1],
  margin: [spacing0, 'auto'],
  padding: [spacing4],

  selectors: {
    ['&:hover, &:focus']: {
      borderColor: themeVars.colour.text,
      backgroundColor: themeVars.colour.text,
      boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
    },
  },
});

export const contentHeadingContainer = style({
  marginTop: [spacing0],
});

export const contentHeading = style({
  color: themeVars.colour.alternative,
  selectors: {
    [`${content} &`]: {
      color: themeVars.colour.alternative,
    },
    [`${content}:hover &,${content}:focus & `]: {
      color: themeVars.colour.secondary,
    },
  },
});

export const contentBody = style({
  color: themeVars.colour.alternative,
  fontSize: fontSize2,
  margin: [spacing2],
  selectors: {
    [`${content} &`]: {
      color: themeVars.colour.text,
    },
    [`${content}:hover &,${content}:focus & `]: {
      color: themeVars.colour.secondary,
    },
  },
});

export const dateText = style({
  fontFamily: [fontFamilyHeading],
  fontSize: [fontSize3],
});
