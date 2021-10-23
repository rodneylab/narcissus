<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import WireIcon from '$lib/components/Icons/Wire.svelte';
  import SocialIcons from '@rodneylab/svelte-social-icons';
  import website from '$lib/config/website';
  import {
    contactAddress,
    contactDetails,
    contactDetailsList,
    contactDetailsListItem,
  } from './contact.css';
  const {
    contactEmail,
    facebookPageName,
    telegramUsername,
    twitterUserId,
    twitterUsername,
    wireUsername,
  } = website;
  import SEO from '$lib/components/SEO/index.svelte';
  import { lightTheme } from '$lib/styles/themes/light.css';

  let title = 'Contact';
  let metadescription = 'Get in touch with Rodneylab, the developer of Climate SvelteKit Starter.';
  const breadcrumbs = [
    {
      name: 'Home',
      slug: '',
    },
    {
      name: 'Contact Us',
      slug: 'contact',
    },
  ];
  const seoProps = {
    breadcrumbs,
    title,
    metadescription,
    slug: 'contact',
    datePublished: '2021-07-07T14:19:33.000+0100',
    lastUpdated: '2021-07-07T14:19:33.000+0100',
  };
</script>

<SEO {...seoProps} />
<Card>
  <h1>Contact me</h1>
  <p>I would love to hear from you. Please get in touch!</p>
  <div class={contactDetails}>
    <ul class={contactDetailsList}>
      <li class={contactDetailsListItem}>
        <SocialIcons
          network="email"
          width={24}
          height={24}
          fgColor="#1d3557"
          bgColor="transparent"
        />
        <span class={contactAddress}>{contactEmail}</span>
      </li>
      <li class={contactDetailsListItem}>
        <SocialIcons
          network="facebook"
          width={24}
          height={24}
          fgColor="#1d3557"
          bgColor="transparent"
        /><ExternalLink
          ariaLabel="D M Rodney Lab on Facebook Messenger"
          href={`https://m.me.${facebookPageName}`}
        >
          <span class={contactAddress}> {facebookPageName}</span>
        </ExternalLink>
      </li>
      <li class={contactDetailsListItem}>
        <SocialIcons
          network="twitter"
          width={24}
          height={24}
          fgColor="#1d3557"
          bgColor="transparent"
        /><ExternalLink
          ariaLabel="D M Rodney Lab on Twitter"
          href={`https://twitter.com/messages/compose?recipient-id=${twitterUserId}`}
        >
          <span class={contactAddress}>@{twitterUsername}</span>
        </ExternalLink>
      </li>
      <li class={contactDetailsListItem}>
        <SocialIcons
          network="telegram"
          width={24}
          height={24}
          fgColor="#1d3557"
          bgColor="transparent"
        /><ExternalLink
          ariaLabel="Message Rodney Lab on Telegram"
          href={`https://t.me/${telegramUsername}`}
        >
          <span class={contactAddress}>{telegramUsername}</span>
        </ExternalLink>
      </li>
      <li class={contactDetailsListItem}>
        <WireIcon />
        <span class={contactAddress}>{wireUsername}</span>
      </li>
    </ul>
  </div></Card
>
