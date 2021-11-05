import { createTheme } from '@vanilla-extract/css';
import { themeVars } from './theme.css';

export const darkTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#32021f',
    alternative: '#a8dadc',
    background: '#1d3557',
    text: '#fed766',
    textAlternative: '#815e5b',
    textSecondary: '#32021f',
    shadow: '#815e5b22',
    accent: '#fed766',
    buttonText: '#fed766',
    buttonBackground: '#1d3557',
  },
});

export { darkTheme as default };
