import { createTheme } from '@vanilla-extract/css';
import { themeVars } from '$lib/styles/themes/theme.css';

export const lightTheme = createTheme(themeVars, {
  colour: {
    primary: '#457b9d',
    secondary: '#a8dadc',
    alternative: '#433633',
    background: '#fcfdfd', // 'hsl(203,20%,99%)',
    text: '#1d3557',
    textAlternative: '#815e5b',
    textSecondary: '#433633',
    accent: '#fff',
    shadow: '#43363321',
    buttonText: 'hsl(203,20%,99%)',
    buttonBackground: '#1d3557',
  },
});
