import { themeVars } from '$lib/styles/themes/theme.css';
import { fontSize2, fontSize3, fontSize4 } from '$lib/styles/vars/font.css';
import { spacing0, spacing12, spacingPx } from '$lib/styles/vars/spacing.css';
import { maxWidthFull } from '$lib/styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

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
  width: [maxWidthFull],
});

export const contactDetails = style({
  listStyleType: 'none',
});

export const header = style({
  fontSize: [fontSize3],
});

export const summaryHeading = style({
  fontSize: [fontSize4],
  marginTop: [spacing0],
  color: themeVars.colour.textSecondary,
});

export const summaryText = style({
  fontSize: [fontSize2],
  color: themeVars.colour.textSecondary,
});

export const extraSummaryText = style({
  color: themeVars.colour.textSecondary,
});
