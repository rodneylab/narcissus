import { themeVars } from '$lib/styles/themes/theme.css';
import { fontFamilyHeading, fontSize2, fontSize3 } from '$lib/styles/vars/font.css';
import {
  spacing0,
  spacing1,
  spacing10,
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

  '@media': {
    '(min-width: 768px)': {
      paddingLeft: 'auto',
      paddingRight: 'auto',
    },
  },
});

export const content = style({
  border: [spacingPx2],
  width: [maxWidthFull],
  margin: [spacing0, 'auto'],
  paddingLeft: [spacing10],
  paddingRight: [spacing10],
  selectors: {
    ['&:hover, &:focus']: {
      borderColor: themeVars.colour.text,
      backgroundColor: themeVars.colour.text,
      boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
    },
  },
  '@media': {
    '(min-width: 768px)': {
      borderRadius: [spacing1],
      padding: [spacing4],
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

export const postMeta = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'flex-start',
});

export const viewsLikesContainer = style({
  display: 'flex',
  margin: [spacing0],
  backgroundColor: 'transparent',
});

export const viewsLikesContent = style({
  borderStyle: 'none',
  boxShadow: 'none',
  backgroundColor: 'transparent',
});

export const dateText = style({
  fontFamily: [fontFamilyHeading],
  fontSize: [fontSize3],
  marginRight: 'auto',
});
