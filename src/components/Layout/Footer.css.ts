import { themeVars } from '../../styles/themes/theme.css';
import {
  spacing0,
  spacing1,
  spacing12,
  spacing24,
  spacing6,
  spacing8,
} from '../../styles/vars/spacing.css';
import { maxWidthFull, maxWidthWrapper } from '../../styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: [maxWidthFull],
  marginTop: [spacing24],
  padding: [spacing12, spacing0],
  backgroundColor: themeVars.colour.alternative,
  color: themeVars.colour.background,
});

export const content = style({
  paddingTop: [spacing12],
  paddingBottom: [spacing8],
  maxWidth: [maxWidthWrapper],
});

export const copyrightText = style({
  textAlign: 'center',
});

export const footerLink = style({
  selectors: {
    [`${content} &`]: {
      color: themeVars.colour.background,
    },
  },
});

export const footerIcons = style({
  display: 'flex',
  padding: [spacing0, spacing8],
});

export const footerIconsList = style({
  display: 'flex',
  margin: [spacing6, spacing0],
});

export const footerIconsListItem = style({
  display: 'flex',
  // margin: [spacing0, spacing4, spacing0, spacing0],
  marginLeft: [spacing1],
  marginRight: [spacing1],
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
