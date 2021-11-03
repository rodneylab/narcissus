import { browser } from '$app/env';
import { writable } from 'svelte/store';

const defaultTheme = 'light';

function getInitialTheme() {
  if (browser) {
    return (
      window.localStorage.getItem('theme') ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );
  }
  return defaultTheme;
}

export const theme = writable<string>(getInitialTheme());

theme.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('theme', value);
  }
});

export { theme as default };
