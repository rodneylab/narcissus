import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { FC, ReactNode } from 'react';

type Dispatch = () => void;
type State = { theme: string };
interface ThemeProviderProps {
  children: ReactNode;
}

function defaultTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ThemeContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function themeReducer(state: State) {
  return { theme: state.theme === 'light' ? 'dark' : 'light' };
}

const ThemeProvider: FC<ThemeProviderProps> = function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: defaultTheme(),
  });
  const value = useMemo(() => ({ state, dispatch }), [dispatch, state]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeProvider, useTheme };
