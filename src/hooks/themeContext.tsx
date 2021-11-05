import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

type Dispatch = () => void;
type State = { theme: string };
// type ThemeProviderProps = { children: ReactNode };

const ThemeContext = createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function themeReducer(state: State) {
  return { theme: state.theme === 'light' ? 'dark' : 'light' };
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, { theme: 'light' });
  const value = { state, dispatch };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeProvider, useTheme };
