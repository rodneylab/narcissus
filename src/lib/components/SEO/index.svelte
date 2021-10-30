<script lang="ts">
  import defaultFeaturedImage from '$lib/assets/home/home.png';
  import defaultOgImage from '$lib/assets/home/home-open-graph.png';
  import defaultOgSquareImage from '$lib/assets/home/home-open-graph-square.png';
  import defaultTwitterImage from '$lib/assets/home/home-twitter.png';

  import website from '$lib/config/website';
  import { VERTICAL_LINE_ENTITY } from '$lib/constants/entities';
  import OpenGraph from './OpenGraph.svelte';
  import SchemaOrg from './SchemaOrg.svelte';
  import Twitter from './Twitter.svelte';

  const {
    author,
    entity,
    facebookAuthorPage,
    facebookPage,
    ogLanguage,
    siteLanguage,
    siteShortTitle,
    siteTitle,
    siteUrl,
    githubPage,
    linkedinProfile,
    telegramUsername,
    tiktokUsername,
    twitterUsername,
  } = website;

  export let article: boolean = false;
  export let breadcrumbs: { name: string; slug: string }[] = [];
  export let entityMeta = null;
  export let lastUpdated: string;
  export let datePublished: string;
  export let metadescription: string;
  export let slug: string;
  export let timeToRead: number = 0;
  export let title: string;

  const defaultAlt =
    'picture of a person with long, curly hair, wearing a red had taking a picture with an analogue camera';

  // imported props with fallback defaults
  export let featuredImage = {
    url: defaultFeaturedImage,
    alt: defaultAlt,
    width: 672,
    height: 448,
    caption: 'Home page',
  };
  export let ogImage = {
    url: defaultOgImage,
    alt: defaultAlt,
  };
  export let ogSquareImage = {
    url: defaultOgSquareImage,
    alt: defaultAlt,
  };
  export let twitterImage = {
    url: defaultTwitterImage,
    alt: defaultAlt,
  };

  const pageTitle = `${siteTitle} ${VERTICAL_LINE_ENTITY} ${title}`;
  const url = `${siteUrl}/${slug}`;
  const openGraphProps = {
    article,
    datePublished,
    lastUpdated,
    image: ogImage,
    squareImage: ogSquareImage,
    metadescription,
    ogLanguage,
    pageTitle,
    siteTitle,
    url,
    ...(article ? { datePublished, lastUpdated, facebookPage, facebookAuthorPage } : {}),
  };
  const schemaOrgProps = {
    article,
    author,
    breadcrumbs,
    datePublished,
    entity,
    lastUpdated,
    entityMeta,
    featuredImage,
    metadescription,
    siteLanguage,
    siteTitle,
    siteTitleAlt: siteShortTitle,
    siteUrl,
    title: pageTitle,
    url,
    facebookPage,
    githubPage,
    linkedinProfile,
    telegramUsername,
    tiktokUsername,
    twitterUsername,
  };
  const twitterProps = {
    article,
    author,
    twitterUsername,
    image: twitterImage,
    timeToRead,
  };
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={metadescription} />
  <meta
    name="robots"
    content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
  />
  <html lang={siteLanguage} />
  <link rel="canonical" href={url} />
</svelte:head>
<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<SchemaOrg {...schemaOrgProps} />
