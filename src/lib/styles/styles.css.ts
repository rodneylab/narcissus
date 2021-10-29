import '$lib/styles/vars/font.css';
import { fontSize2, fontWeightBlack, lineHeightNormal } from '$lib/styles/vars/font.css';
import { globalStyle, style } from '@vanilla-extract/css';
import { themeVars } from './themes/theme.css';
import {
  spacing0,
  spacing1,
  spacing12,
  spacing2,
  spacing4,
  spacing6,
  spacing8,
  spacingPx,
} from './vars/spacing.css';

globalStyle('nav :is(ul, ol)', {
  listStyleType: 'none',
});

globalStyle('html', {
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      scrollBehavior: 'smooth',
    },
  },
});

globalStyle('hr', {
  height: [spacingPx],
  border: [spacing0],
});

globalStyle('html & :is (h1, h2, h3, h4, h5, h6, h7)', {
  margin: [spacing12, spacing0, spacing6],
});

globalStyle('ol, ul', {
  marginLeft: [spacing0],
  marginRight: [spacing0],
  padding: [spacing0],
  marginBottom: [spacing8],
  listStylePosition: 'inside',
  listStyleImage: 'none',
});

globalStyle('a', {
  color: themeVars.colour.alternative,
});

globalStyle('a:hover, a:focus', {
  textDecoration: 'none',
});

globalStyle('button', {
  cursor: 'pointer',
  borderRadius: [spacing6],
  padding: [spacing2, spacing4],
  fontSize: [fontSize2],
  fontWeight: [fontWeightBlack],
  backgroundColor: themeVars.colour.buttonBackground,
  borderStyle: 'solid',
  borderColor: themeVars.colour.secondary,
  color: themeVars.colour.buttonText,
  '@media': {
    '(prefers-reduced-motion: no-preference)': {
      transition: 'color 0.25s',
    },
    '(prefers-reduced-motion: reduce)': {
      transition: 'color 2s',
    },
  },
});

globalStyle('button:focus, button:hover', {
  backgroundColor: themeVars.colour.buttonText,
  color: themeVars.colour.buttonBackground,
});

globalStyle('input, textarea', {
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  borderColor: themeVars.colour.textSecondary,
  background: themeVars.colour.background,
  borderRadius: [spacing1],
  lineHeight: [lineHeightNormal],
  padding: [spacing0, spacing2],
  color: themeVars.colour.text,
});

globalStyle(':is(input, textarea)::placeholder', {
  color: themeVars.colour.text,
  opacity: 0.8,
});

export const screenReaderText = style({
  border: 0,
  clip: 'rect(1px, 1px, 1px, 1px)',
  clipPath: 'insert(50%)',
  height: '1px',
  margin: '-1px',
  width: '1px',
  overflow: 'hidden',
  position: 'absolute',
  wordWrap: 'normal',
});
