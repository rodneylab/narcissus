import { globalStyle } from '@vanilla-extract/css';
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

globalStyle('a:hover, a:focus', {
  textDecoration: 'none',
});
