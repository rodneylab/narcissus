import { createTheme } from '@vanilla-extract/css';
import { themeVars } from '$lib/styles/themes/theme.css';

export const lightTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#a8dadc',
    alternative: '#433633',
    background: '#f1faee',
    text: '#1d3557',
    textAlternative: '#815e5b',
  },
});
