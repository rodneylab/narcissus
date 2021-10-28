import { themeVars } from '$lib/styles/themes/theme.css';
import { spacing12, spacing2, spacing6, spacing8, spacingPx2 } from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  marginTop: [spacing12],
  paddingBottom: [spacing6],
});

export const content = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx2],
  borderRadius: [spacing2],
  paddingLeft: [spacing6],
  borderColor: themeVars.colour.text,
  boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
  color: themeVars.colour.text,
});

export const icon = style({
  paddingRight: [spacing2],
  verticalAlign: 'middle',
});

export const meta = style({
  selectors: {
    [`${container} &:not(:last-child)`]: {
      paddingRight: [spacing8],
    },
    [`${container} &:last-child`]: {
      paddingRight: [spacing6],
    },
  },
});

export const link = style({
  selectors: {
    [`${meta} &`]: {
      color: themeVars.colour.text,
    },
  },
});

export const likeButton = style({
  borderStyle: 'none',
  marginLeft: '-1rem',
  marginRight: '-1.25rem',
  background: 'transparent',
  color: themeVars.colour.text,
});
