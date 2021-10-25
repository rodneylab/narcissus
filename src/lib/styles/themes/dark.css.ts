import { createTheme } from '@vanilla-extract/css';
import { themeVars } from './theme.css';

export const darkTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#a8dadc',
    alternative: '#e63946',
    background: '#1d3557',
    text: '#f1faee',
  },
});
