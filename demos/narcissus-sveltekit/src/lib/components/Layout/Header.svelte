<script lang="ts">
  import SunIcon from '$lib/components/Icons/Sun.svelte';
  import MoonIcon from '$lib/components/Icons/Moon.svelte';
  import theme from '$lib/shared/stores/theme';
  import {
    container,
    content,
    nav,
    navLink,
    navLinkActive,
    navList,
    navListItem,
    themeButton,
    themeButtonContainer,
  } from './Header.css';
  $: lightThemeActive = $theme === 'light';
  $: themeButtonText = `Switch to ${lightThemeActive ? 'dark' : 'light'} theme`;
  import { screenReaderText } from '$lib/styles/styles.css';
  import { browser } from '$app/env';

  const handleClick = () => {
    lightThemeActive ? theme.set('dark') : theme.set('light');
    browser && document.getElementById('theme-button').blur();
  };

  export let slug: string;
</script>

<header class={container}>
  <div class={themeButtonContainer}>
    <button id="theme-button" class={themeButton} on:click={handleClick}
      ><span class={screenReaderText}>{themeButtonText}</span>
      {#if lightThemeActive}
        <MoonIcon label="Switch to dark mode" scale={1.5} />
      {:else}
        <SunIcon label="Switch to light mode" scale={1.5} />
      {/if}</button
    >
  </div>
  <div class={content}>
    <!-- svelte-ignore component-name-lowercase -->
    <nav class={nav} aria-label="Site navigation">
      <ul class={navList}>
        <li class={navListItem}>
          <a class={`${navLink}${slug === '/' ? ` ${navLinkActive}` : ''}`} href="/.">Home</a>
        </li>
        <li class={navListItem}>
          <a class={`${navLink}${slug === '/contact' ? ` ${navLinkActive}` : ''}`} href="/contact"
            >Contact</a
          >
        </li>
      </ul>
    </nav>
  </div>
</header>
