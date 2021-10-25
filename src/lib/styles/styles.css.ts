import '$lib/styles/vars/font.css';
import { globalStyle, style } from '@vanilla-extract/css';
import { insert } from 'svelte/internal';
import { themeVars } from './themes/theme.css';
import { spacing0, spacing12, spacing6, spacingPx } from './vars/spacing.css';

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

globalStyle('a', {
  color: themeVars.colour.alternative,
});

globalStyle('a:hover, a:focus', {
  textDecoration: 'none',
});

globalStyle('button', {
  cursor: 'pointer',
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
