import { createTheme } from '@vanilla-extract/css';
import { themeVars } from '$lib/styles/themes/theme.css';

export const lightTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#a8dadc',
    alternative: '#e63946',
    background: '#f1faee',
    text: '#1d3557',
  },
});
