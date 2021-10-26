import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize2 } from '$lib/styles/vars/font.css';
import { spacing12, spacing2, spacing4, spacingPx } from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

export const summaryText = style({
  fontSize: [fontSize2],
});

export const cardContainer = style({
  marginTop: [spacing12],
  marginBottom: [spacing12],
});

export const cardContent = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  borderColor: themeVars.colour.secondary,
  boxShadow: `0.125rem 0.25rem 0.25rem ${themeVars.colour.shadow}`,
  backgroundColor: themeVars.colour.accent,
  width: '60%',
});

export const contactDetails = style({
  listStyleType: 'none',
});

export const contactDetailsList = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const contactDetailsListItem = style({
  display: 'flex',
  alignItems: 'center',
  marginBottom: [spacing4],
  fontSize: [fontSize2],
});

export const contactAddress = style({
  marginLeft: [spacing2],
  selectors: {
    [`${cardContent} &`]: {
      color: themeVars.colour.textSecondary,
      textDecorationColor: themeVars.colour.textSecondary,
    },
  },
});
