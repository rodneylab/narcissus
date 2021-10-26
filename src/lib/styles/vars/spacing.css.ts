import { createVar, globalStyle } from '@vanilla-extract/css';

export const spacingPx = createVar();
export const spacingPx2 = createVar();

export const spacing0 = createVar();
export const spacing1 = createVar();
export const spacing2 = createVar();
export const spacing3 = createVar();
export const spacing4 = createVar();
export const spacing5 = createVar();
export const spacing6 = createVar();
export const spacing8 = createVar();
export const spacing12 = createVar();
export const spacing16 = createVar();
export const spacing20 = createVar();
export const spacing24 = createVar();

globalStyle('html, body', {
  vars: {
    [spacingPx]: '1px',
    [spacingPx2]: '2px',
    [spacing0]: '0',
    [spacing1]: '0.25rem',
    [spacing2]: '0.5rem',
    [spacing3]: '0.75rem',
    [spacing4]: '1rem',
    [spacing5]: '1.25rem',
    [spacing6]: '1.5rem',
    [spacing8]: '2rem',
    [spacing12]: '3rem',
    [spacing16]: '4rem',
    [spacing20]: '5rem',
    [spacing24]: '6rem',
  },
});
