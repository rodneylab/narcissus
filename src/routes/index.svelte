<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    const url = `./index.json`;
    // const response = await fetch(url)
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      return {
        props: { ...(await response.json()) },
      };
    }

    return {};
  }
</script>

<script>
  import featuredImageSrc from '$lib/assets/home/home.png';
  import ogImageSrc from '$lib/assets/home/home-open-graph.png';
  import ogSquareImageSrc from '$lib/assets/home/home-open-graph-square.png';
  import twitterImageSrc from '$lib/assets/home/home-twitter.png';
  import BlogRoll from '$lib/components/BlogRoll.svelte';
  import Card from '$lib/components/Card.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import website from '$lib/config/website';
  import {
    cardContainer,
    cardContent,
    extraSummaryText,
    header,
    summaryHeading,
    summaryText,
  } from './index.css';

  export let posts;

  const { author, siteUrl } = website;

  let title = 'Home';
  const breadcrumbs = [
    {
      name: 'Home',
      slug: '',
    },
  ];
  let metadescription =
    'Narcissus is a proof of concept backend as a service app which lets you create a blog site quicker.';
  const featuredImageAlt = 'Narcissus banner with Rodney Lab logo and Narcissus text';
  const featuredImage = {
    url: featuredImageSrc,
    alt: featuredImageAlt,
    width: 1280,
    height: 640,
    caption: 'Narcissus',
  };
  const ogImage = {
    url: ogImageSrc,
    alt: featuredImageAlt,
  };
  const ogSquareImage = {
    url: ogSquareImageSrc,
    alt: featuredImageAlt,
  };

  const twitterImage = {
    url: twitterImageSrc,
    alt: featuredImageAlt,
  };
  const entityMeta = {
    url: `${siteUrl}/`,
    faviconWidth: 512,
    faviconHeight: 512,
    caption: author,
  };
  const seoProps = {
    title,
    slug: '',
    entityMeta,
    datePublished: '2021-07-07T14:19:33.000+0100',
    lastUpdated: '2021-07-07T14:19:33.000+0100',
    breadcrumbs,
    metadescription,
    featuredImage,
    ogImage,
    ogSquareImage,
    twitterImage,
  };
</script>

<SEO {...seoProps} />
<!-- svelte-ignore component-name-lowercase -->
<header class={header}>
  <h1>Narcissus: API as a Service / Backendless Blog</h1>
</header>
<Card containerClass={cardContainer} contentClass={cardContent}>
  <h2 class={summaryHeading}><span>About Narcissus</span></h2>
  <p class={summaryText}>
    Narcissus is a proof of concept <strong>backend as a service</strong> app which lets you create
    a blog site quicker by managing important blog features like
    <strong>comment and message forms</strong>
    as well as post
    <strong>views and likes</strong>.
  </p>
  <p class={extraSummaryText}>
    This demo <strong>Svelte</strong> site is static and uses Serverless
    <strong>Rust Cloudflare Workers</strong>
    to read and create comments as well as other interactive elements using REST requests, adding spam
    detection and Captchas without the added hassle of adding spam detection and Captchas. The app is
    backed by a <strong>Supabase</strong> PostgreSQL database.
  </p>
</Card>
<BlogRoll {posts} />
