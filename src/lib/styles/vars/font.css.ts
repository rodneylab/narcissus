import { createVar, globalFontFace, globalStyle } from '@vanilla-extract/css';

export const fontFamilyHeading = createVar();
export const fontFamilyBody = createVar();

export const mobileFontSizeRoot = createVar();
export const mobileFontSize0 = createVar();
export const mobileFontSize1 = createVar();
export const mobileFontSize2 = createVar();
export const mobileFontSize3 = createVar();
export const mobileFontSize4 = createVar();
export const mobileFontSize5 = createVar();
export const mobileFontSize6 = createVar();
export const mobileFontSize7 = createVar();

export const fontSizeRoot = createVar();
export const fontSize0 = createVar();
export const fontSize1 = createVar();
export const fontSize2 = createVar();
export const fontSize3 = createVar();
export const fontSize4 = createVar();
export const fontSize5 = createVar();
export const fontSize6 = createVar();
export const fontSize7 = createVar();

export const fontWeightLight = createVar();
export const fontWeightNormal = createVar();
export const fontWeightMedium = createVar();
export const fontWeightSemibold = createVar();
export const fontWeightBold = createVar();
export const fontWeightExtrabold = createVar();
export const fontWeightBlack = createVar();

export const lineHeightNone = createVar();
export const lineHeightTight = createVar();
export const lineHeightNormal = createVar();
export const lineHeightRelaxed = createVar();

globalFontFace('BodyFont', {
  src: 'local("Lato")',
});

globalFontFace('HeadingFont', {
  src: 'local("Slabo 27px")',
});

globalStyle('html, body', {
  vars: {
    [fontFamilyBody]:
      "'BodyFont', 'Open Sans', 'Montserrat', system-ui, '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', sans-serif,",
    [fontWeightLight]: '300',
    [fontWeightNormal]: '400',
    [fontWeightMedium]: '500',
    [fontWeightSemibold]: '600',
    [fontWeightBold]: '700',
    [fontWeightExtrabold]: '800',
    [fontWeightBlack]: '900',

    [mobileFontSize0]: '0.8889rem',
    [mobileFontSize1]: '1rem',
    [mobileFontSize2]: '1.125rem',
    [mobileFontSize3]: '1.266rem',
    [mobileFontSize4]: '1.424rem',
    [mobileFontSize5]: '1.602rem',
    [mobileFontSize6]: '1.802rem',
    [mobileFontSize7]: '3.815rem',

    [fontSizeRoot]: '16px',
    [fontSize0]: '0.8rem',
    [fontSize1]: '1rem',
    [fontSize2]: '1.25rem',
    [fontSize3]: '1.563rem',
    [fontSize4]: '1.953rem',
    [fontSize5]: '2.441rem',
    [fontSize6]: '3.052rem',
    [fontSize7]: '3.815rem',

    [lineHeightNone]: '1',
    [lineHeightTight]: '1.3',
    [lineHeightNormal]: '1.5',
    [lineHeightRelaxed]: '1.75',
  },
});

globalStyle('html', {
  lineHeight: [lineHeightNormal],
  fontSize: [fontSizeRoot],
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

globalStyle('body', {
  vars: {
    [fontFamilyBody]: 'BodyFont',
    [fontFamilyHeading]:
      '"Slabo 27px", "Roboto Slab", "Noto Serif", Merriweather, Georgia, Cambria, "Times New Roman", Times, serif',
  },
  fontFamily: [fontFamilyBody],
  fontSize: [fontSize1],
  textRendering: 'optimizeLegibility',
});

globalStyle('h1, h2, h3, h4, h5, h6, h7', {
  fontFamily: [fontFamilyHeading],
});

globalStyle('h1, h2, h3, h4, h5, h6, h7', {
  lineHeight: [lineHeightTight],
});

globalStyle('h3, h4, h5, h6', {
  fontWeight: [fontWeightBold],
});

globalStyle('h1', {
  fontWeight: [fontWeightBlack],
  fontSize: [mobileFontSize6],
  fontFamily: 'Slabo 13',
  '@media': {
    '(min-width: 768px)': {
      fontSize: [fontSize6],
    },
  },
});

globalStyle('h2', {
  fontSize: [mobileFontSize5],
  '@media': {
    '(min-width: 768px)': {
      fontSize: [fontSize5],
    },
  },
});

globalStyle('h3', {
  fontSize: [mobileFontSize4],
  '@media': {
    '(min-width: 768px)': {
      fontSize: [fontSize4],
    },
  },
});

globalStyle('h4', {
  fontSize: [mobileFontSize3],
  '@media': {
    '(min-width: 768px)': {
      fontSize: [fontSize3],
    },
  },
});

globalStyle('h5', {
  fontSize: [mobileFontSize2],
  '@media': {
    '(min-width: 768px)': {
      fontSize: [fontSize2],
    },
  },
});

globalStyle('h6', {
  fontSize: [mobileFontSize1],
  '@media': {
    '(min-width: 768px)': {
      fontSize: [fontSize1],
    },
  },
});

globalStyle('p', {
  lineHeight: [lineHeightRelaxed],
});
