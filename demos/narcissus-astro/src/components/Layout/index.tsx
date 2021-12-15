// Lato
// [100,300,400,700,900]
// [italic,normal]
import '@fontsource/lato';
import '@fontsource/roboto-slab';
import '@fontsource/roboto-slab/700.css';
import '@fontsource/roboto-slab/900.css';
import '@fontsource/slabo-13px';
// Slabo 27px
// [400]
// [normal]
import '@fontsource/slabo-27px';
import type { FC } from 'react';
import { ThemeProvider, useTheme } from '$hooks/themeContext';
import '$styles/normalise.css';
import '$styles/styles.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import darkTheme from '$styles/themes/dark.css';
import lightTheme from '$styles/themes/light.css';
import Footer from '$components/Layout/Footer';
import Header from '$components/Layout/Header';
import { container, main } from '$components/Layout/layout.css';

config.autoAddCss = false;

interface LayoutProps {
  slug: string;
}

const Layout: FC<LayoutProps> = function Layout({ children, slug }) {
  const {
    state: { theme },
  } = useTheme();

  const containerClass = `${container} ${theme === 'light' ? lightTheme : darkTheme}`;

  return (
    <div className={containerClass}>
      <Header slug={slug} />
      <main className={main}>{children}</main>
      <Footer />
    </div>
  );
};

const ThemeWrapper: FC<LayoutProps> = function ThemeWrapper({ children, slug }) {
  return (
    <ThemeProvider>
      <Layout slug={slug}> {children} </Layout>
    </ThemeProvider>
  );
};

export default ThemeWrapper;
