import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize4 } from '$lib/styles/vars/font.css';
import { spacing0, spacing1, spacing12, spacing3, spacing6 } from '$lib/styles/vars/spacing.css';
import { maxWidthFull, maxWidthWrapper } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  maxWidth: [maxWidthWrapper],
  width: [maxWidthFull],
  margin: [spacing0, 'auto', spacing12],
});

export const themeButtonContainer = style({
  display: 'flex',
  width: [maxWidthFull],
});

export const themeButton = style({
  borderStyle: 'none',
  backgroundColor: 'transparent',
  color: themeVars.colour.text,
  padding: [spacing3],
  marginLeft: 'auto',
  selectors: {
    ['&:hover, &:focus']: {
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

export const content = style({
  flexDirection: 'row',
  width: [maxWidthFull],
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
  marginBottom: [spacing0],
});

export const navListItem = style({
  display: 'flex',
  fontSize: [fontSize4],
  marginLeft: [spacing6],
  marginBottom: [spacing1],
});

// export const logo = style({
//   color: themeVars.colour.alternative,
// });

// export const hoverJump = style({
//   selectors: {
//     ['&:hover, &:focus']: {
//       transform: 'translateY(-0.5rem)',
//     },
//   },
//   '@media': {
//     '(prefers-reduced-motion: no-preference)': {
//       transition: 'all 0.25s ease-in-out',
//     },
//     '(prefers-reduced-motion: reduce)': {
//       transition: 'all 2s ease-in-out',
//     },
//   },
// });
