import { createTheme } from '@vanilla-extract/css';
import { themeVars } from './theme.css';

export const darkTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#a8dadc',
    alternative: '#a8dadc',
    background: '#1d3557',
    text: '#fed766',
    textAlternative: '#815e5b',
  },
});
