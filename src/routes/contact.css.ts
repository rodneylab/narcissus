import { fontSize2 } from '$lib/styles/vars/font.css';
import { spacing2 } from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

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
  paddingLeft: [spacing2],
  fontSize: [fontSize2],
});

export const contactAddress = style({
  marginLeft: [spacing2],
});
