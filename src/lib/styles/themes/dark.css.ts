import { createTheme } from '@vanilla-extract/css';
import { themeVars } from './theme.css';

export const darkTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#a8dadc',
    alternative: '#32021f',
    background: '#1d3557',
    text: '#fed766',
    textAlternative: '#815e5b',
    shadow: '#815e5b22',
    accent: '#a8dadc',
  },
});
