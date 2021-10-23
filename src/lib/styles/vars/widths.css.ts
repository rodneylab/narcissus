import { createVar, globalStyle } from '@vanilla-extract/css';

export const maxWidthNone = createVar();
export const maxWidth3XS = createVar();
export const maxWidth2XS = createVar();
export const maxWidthXS = createVar();
export const maxWidthSM = createVar();
export const maxWidthMD = createVar();
export const maxWidthLG = createVar();
export const maxWidthXL = createVar();
export const maxWidth2XL = createVar();
export const maxWidth3XL = createVar();
export const maxWidth4XL = createVar();
export const maxWidth5XL = createVar();
export const maxWidth6XL = createVar();
export const maxWidth7XL = createVar();
export const maxWidth8XL = createVar();
export const maxWidthFull = createVar();
export const maxWidthWrapper = createVar();
export const desktopBreakpoint = createVar();

export const maxWidthContainerSM = createVar();
export const maxWidthContainerMD = createVar();
export const maxWidthContainerLG = createVar();
export const maxWidthContainerXL = createVar();

globalStyle('html, body', {
  vars: {
    [maxWidthNone]: 'none',
    [maxWidth3XS]: '14rem',
    [maxWidth2XS]: '16rem',
    [maxWidthXS]: '20rem',
    [maxWidthSM]: '24rem',
    [maxWidthMD]: '28rem',
    [maxWidthLG]: '32rem',
    [maxWidthXL]: '36rem',
    [maxWidth2XL]: '42rem',
    [maxWidth3XL]: '48rem',
    [maxWidth4XL]: '56rem',
    [maxWidth5XL]: '64rem',
    [maxWidth6XL]: '72rem',
    [maxWidth7XL]: '80rem',
    [maxWidth8XL]: '90rem',
    [maxWidthFull]: '100%',
    [maxWidthWrapper]: maxWidth2XL,
    [desktopBreakpoint]: '48rem',

    [maxWidthContainerSM]: '40rem',
    [maxWidthContainerMD]: '48rem',
    [maxWidthContainerLG]: '64rem',
    [maxWidthContainerXL]: '80rem',
  },
});
