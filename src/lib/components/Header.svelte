<script>
  import CameraIcon from '$lib/components/Icons/Camera.svelte';
  import { container, hoverJump, logo, nav, navList, navListItem } from './Header.css';
</script>

<header class={container}>
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
