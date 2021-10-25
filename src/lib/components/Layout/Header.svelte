<script>
  import CameraIcon from '$lib/components/Icons/Camera.svelte';
  import SunIcon from '$lib/components/Icons/Sun.svelte';
  import MoonIcon from '$lib/components/Icons/Moon.svelte';
  import theme from '$lib/shared/stores/theme';
  import {
    container,
    hoverJump,
    logo,
    nav,
    navList,
    navListItem,
    themeButton,
    themeButtonContainer,
  } from './Header.css';
  $: lightThemeActive = $theme === 'light';
  $: themeButtonText = `Switch to ${lightThemeActive ? 'dark' : 'light'} theme`;
  import { screenReaderText } from '$lib/styles/styles.css';
</script>

<header class={container}>
  <div class={themeButtonContainer}>
    <button
      class={themeButton}
      on:click={() => {
        lightThemeActive ? theme.set('dark') : theme.set('light');
      }}
      ><span class={screenReaderText}>{themeButtonText}</span>
      {#if lightThemeActive}
        <MoonIcon />
      {:else}
        <SunIcon />
      {/if}</button
    >
  </div>
  <a aria-label="Jump to Home page" class={hoverJump} href="./"
    ><span class={logo}><CameraIcon size="96" /></span></a
  >
  <!-- svelte-ignore component-name-lowercase -->
  <nav class={nav}>
    <ul class={navList}>
      <li class={navListItem}><a href="/.">Home</a></li>
      <li class={navListItem}><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
