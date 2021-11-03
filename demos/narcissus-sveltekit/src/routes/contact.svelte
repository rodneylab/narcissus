<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import ExternalLink from '$lib/components/ExternalLink.svelte';
  import MessageForm from '$lib/components/MessageForm.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import website from '$lib/config/website';
  import theme from '$lib/shared/stores/theme';
  import SocialIcons from '@rodneylab/svelte-social-icons';
  import {
    cardContainer,
    cardContent,
    contactAddress,
    contactDetails,
    contactDetailsList,
    contactDetailsListItem,
    summaryText,
  } from './contact.css';
  const { contactEmail, facebookPageName, telegramUsername, twitterUserId, twitterUsername } =
    website;

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
  $: fgColor = $theme === 'light' ? '#433633' : '#32021f';
  const width = 36;
  const height = 36;
</script>

<SEO {...seoProps} />
<h1>Contact me</h1>
<p class={summaryText}>I would love to hear from you. Please get in touch!</p>
<MessageForm />
<Card containerClass={cardContainer} contentClass={cardContent}>
  <div class={contactDetails}>
    <ul class={contactDetailsList}>
      <li class={contactDetailsListItem}>
        <SocialIcons network="email" width={36} height={36} {fgColor} bgColor="transparent" />
        <span class={contactAddress}>{contactEmail}</span>
      </li>
      <li class={contactDetailsListItem}>
        <SocialIcons
          network="facebook"
          {width}
          {height}
          {fgColor}
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
          {width}
          {height}
          {fgColor}
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
          {width}
          {height}
          {fgColor}
          bgColor="transparent"
        /><ExternalLink
          ariaLabel="Message Rodney Lab on Telegram"
          href={`https://t.me/${telegramUsername}`}
        >
          <span class={contactAddress}>{telegramUsername}</span>
        </ExternalLink>
      </li>
    </ul>
  </div></Card
>
