// Lato
// [100,300,400,700,900]
// [italic,normal]
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';
import '@fontsource/roboto-slab/400.css';
import '@fontsource/roboto-slab/700.css';
import '@fontsource/roboto-slab/900.css';
import '@fontsource/slabo-13px/400.css';
// Slabo 27px
// [400]
// [normal]
import '@fontsource/slabo-27px/400.css';
import React from 'react';
import '../../styles/normalise.css';
import darkTheme from '../../styles/themes/dark.css';
import lightTheme from '../../styles/themes/light.css';
import Footer from './Footer';
import Header from './Header';
import { container, main } from './layout.css';

const Layout = ({ children, slug }: { children: React.ReactNode; slug: string }) => {
  const lightThemeActive = false;
  const containerClass = `${container} ${lightThemeActive ? lightTheme : darkTheme}`;

  return (
    <div className={containerClass}>
      <Header slug={slug} />
      <main className={main}>{children}</main>
      <Footer />
    </div>
  );
};

export { Layout as default };
