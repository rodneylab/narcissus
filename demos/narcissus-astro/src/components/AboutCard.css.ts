import { themeVars } from '../styles/themes/theme.css';
import { fontSize2, fontSize3, fontSize4 } from '../styles/vars/font.css';
import { spacing0, spacing1, spacing12, spacingPx, spacingPx2 } from '../styles/vars/spacing.css';
import { maxWidthFull } from '../styles/vars/widths.css';
import { style } from '@vanilla-extract/css';

export const cardContainer = style({
  marginTop: [spacing12],
  marginBottom: [spacing12],
});

export const cardContent = style({
  borderStyle: 'solid',
  borderWidth: [spacingPx],
  borderColor: themeVars.colour.secondary,
  boxShadow: `${spacingPx2} ${spacing1} ${spacing1} ${themeVars.colour.shadow}`,
  backgroundColor: themeVars.colour.accent,
  width: [maxWidthFull],
});

export const contactDetails = style({
  listStyleType: 'none',
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
