import { spacing2 } from '$lib/styles/vars/spacing.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  color: '#032539',
  fontFamily: 'Lato',
});

export const logo = style({
  verticalAlign: 'middle',
  padding: ['auto', spacing2],
});

export const rodneyLabText = style({
  fontWeight: 300,
});
