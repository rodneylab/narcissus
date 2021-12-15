import { themeVars } from '../styles/themes/theme.css';
import { fontWeightBold } from '../styles/vars/font.css';
import {
  spacing1,
  spacing12,
  spacing2,
  spacing4,
  spacing5,
  spacing6,
  spacing8,
  spacingPx2,
} from '../styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

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
  boxShadow: `${spacingPx2} ${spacing1} ${spacing1} ${themeVars.colour.shadow}`,
  fontWeight: [fontWeightBold],
});

export const icon = style({
  paddingRight: [spacing2],
  verticalAlign: 'middle',
});

export const meta = style({
  flexDirection: 'row',
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
      color: 'inherit',
      textDecoration: 'none',
    },
  },
});

export const likeButton = style({
  borderStyle: 'none',
  marginLeft: `${calc(spacing4).negate()}`,
  marginRight: `${calc(spacing5).negate()}`,
  background: 'transparent',
  color: 'inherit',
});
