import { themeVars } from '$lib/styles/themes/theme.css';
import { spacing0, spacing12, spacing24, spacing4, spacing6 } from '$lib/styles/vars/spacing.css';
import { maxWidthFull, maxWidthWrapper } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: [maxWidthWrapper],
  width: [maxWidthFull],
  // margin: [spacing12, 'auto', spacing0],
  marginTop: [spacing24],
  padding: [spacing12, spacing0],
  backgroundColor: themeVars.colour.alternative,
  color: themeVars.colour.background,
});

export const footerIcons = style({
  display: 'flex',
});

export const footerIconsList = style({
  display: 'flex',
  margin: [spacing6, spacing0],
});

export const footerIconsListItem = style({
  display: 'flex',
  margin: [spacing0, spacing4, spacing0, spacing0],
  selectors: {
    ['&:hover, &:focus']: {
      transform: 'translateY(-0.5rem)',
    },
  },
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: 'all 0.25s ease-in-out',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'all 2s ease-in-out',
    },
  },
});
