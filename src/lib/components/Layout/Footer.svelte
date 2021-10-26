<script>
  import { COPYRIGHT_ENTITY } from '$lib/constants/entities';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  const { facebookPage, githubPage, linkedinProfile, tiktokUsername, twitterUsername } = website;
  import RodneyLabCredit from '$lib/components/Layout/RodneyLabCredit.svelte';
  import website from '$lib/config/website';
  import SocialIcons from '@rodneylab/svelte-social-icons';
  import {
    container,
    content,
    copyrightText,
    footerIcons,
    footerIconsList,
    footerIconsListItem,
    footerLink,
  } from '$lib/components/Layout/Footer.css';
  import theme from '$lib/shared/stores/theme';
  $: fgColor = $theme === 'light' ? '#f1faee' : '#1d3557';
</script>

<footer class={container}>
  <div class={content}>
    <div class={copyrightText}>
      Created by <a
        aria-label="Open the Rodney Lab site"
        class={footerLink}
        href="https://rodneylab.com/"
        target="_blank"
        rel="noopener noreferrer">Rodney Lab</a
      >. Copyright {COPYRIGHT_ENTITY} 2021.
    </div>
    <nav class={footerIcons}>
      <ul class={footerIconsList}>
        <li class={footerIconsListItem}>
          <ExternalLink
            ariaLabel="Go to the Rodney Lab Tik Tok Page"
            href={`https://www.tiktok.com/${tiktokUsername}`}
            ><SocialIcons network="tiktok" fgColor="transparent" bgColor={fgColor} /></ExternalLink
          >
        </li>
        <li class={footerIconsListItem}>
          <ExternalLink ariaLabel="Go to the Rodney Lab Facebook Page" href={facebookPage}
            ><SocialIcons network="facebook" {fgColor} bgColor="transparent" /></ExternalLink
          >
        </li>
        <li class={footerIconsListItem}>
          <ExternalLink
            ariaLabel="Go to the Rodney Lab Twitter Page"
            href={`https://twitter.com/intent/user?screen_name=${twitterUsername}`}
            ><SocialIcons network="twitter" {fgColor} bgColor="transparent" /></ExternalLink
          >
        </li>
        <li class={footerIconsListItem}>
          <ExternalLink
            ariaLabel="Go to the Rodney Lab Linked In Page"
            href={`https://uk.linkedin.com/in/${linkedinProfile}`}
            ><SocialIcons network="linkedin" {fgColor} bgColor="transparent" /></ExternalLink
          >
        </li>
        <li class={footerIconsListItem}>
          <ExternalLink
            ariaLabel="Go to the Rodney Lab Git Hub In Page"
            href={`https://github.com/${githubPage}`}
            ><SocialIcons network="github" {fgColor} bgColor="transparent" /></ExternalLink
          >
        </li>
      </ul>
    </nav>
    <RodneyLabCredit />
  </div>
</footer>
