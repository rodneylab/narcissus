import { themeVars } from '../../styles/themes/theme.css';
import { fontFamilyHeading, fontSize1, fontSize5 } from '../../styles/vars/font.css';
import {
  spacing0,
  spacing1,
  spacing12,
  spacing2,
  spacing3,
  spacing4,
  spacing6,
} from '../../styles/vars/spacing.css';
import { maxWidthFull, maxWidthWrapper } from '../../styles/vars/widths.css';
import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  width: [maxWidthFull],
  marginBottom: [spacing12],
  '@media': {
    '(min-width: 768px)': {
      maxWidth: [maxWidthWrapper],
      margin: [spacing0, 'auto', spacing12],
    },
  },
});

export const themeButtonContainer = style({
  display: 'flex',
  width: [maxWidthFull],
  paddingTop: [spacing4],
  paddingBottom: [spacing4],
  paddingLeft: [spacing6],
  paddingRight: [spacing6],
  '@media': {
    '(min-width: 768px)': {
      paddingRight: [spacing0],
    },
  },
});

export const themeButton = style({
  borderStyle: 'none',
  backgroundColor: 'transparent',
  color: themeVars.colour.text,
  padding: [spacing3],
  marginLeft: 'auto',
  marginRight: `${calc(spacing3).negate()}`,
  selectors: {
    '&:hover, &:focus': {
      color: themeVars.colour.text,
      backgroundColor: 'transparent',
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

export const themeIcon = style({
  width: [spacing6],
  height: [spacing6],
});

export const content = style({
  flexDirection: 'row',
  width: [maxWidthFull],
  fontFamily: [fontFamilyHeading],
  paddingRight: [spacing6],
  '@media': {
    '(min-width: 768px)': {
      paddingRight: [spacing0],
    },
  },
});

export const nav = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginLeft: ['auto'],
});

export const navList = style({
  display: 'flex',
  alignItems: 'flex-end',
  paddingBottom: [spacing0],
  margin: [spacing0],
  selectors: {
    [`ul &`]: {
      marginTop: [spacing0],
    },
  },
});

export const navListItem = style({
  display: 'flex',
  fontSize: [fontSize5],
  marginLeft: [spacing6],
  marginBottom: [spacing1],
});

export const navLink = style({
  textUnderlineOffset: [spacing2],
  selectors: {
    [`${nav} &`]: {
      textDecoration: 'none',
    },
    [`${nav} &:hover`]: {
      textDecoration: 'underline',
    },
  },
});

export const navLinkActive = style({
  selectors: {
    [`${nav} &`]: {
      textDecoration: 'underline',
    },
    [`${nav} &:hover`]: {
      textUnderlineOffset: [spacing1],
    },
  },
});
