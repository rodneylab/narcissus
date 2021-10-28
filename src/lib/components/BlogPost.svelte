<script lang="ts">
  import readingTime from 'reading-time';
  import BannerImage from '$lib/components/BannerImage.svelte';
  import SEO from '$lib/components/SEO/index.svelte';
  import PostViewsLikes from '$lib/components/PostViewsLikes.svelte';

  export let imageData: {
    ogImage: string;
    ogSquareImage: string;
    src: string;
    twitterImage: string;
    alt: string;
    width: number;
    height: number;
    sources: { srcset: string; type: string }[];
    placeholder: string;
  };
  export let post: {
    datePublished: string;
    featuredImageAlt: string;
    lastUpdated: string;
    postTitle: string;
    seoMetaDescription: string;
    slug: string;
    body: string;
    likes: number;
    views: number;
    comments: { created_at: string; author: string; text: string }[];
  };

  const {
    datePublished,
    featuredImageAlt,
    lastUpdated,
    postTitle: title,
    seoMetaDescription: metadescription,
    slug,
  } = post;
  const { ogImage, ogSquareImage, src: featuredImage, twitterImage } = imageData;
  const timeToRead = Math.ceil(readingTime(post.body).minutes);

  const breadcrumbs = [
    {
      name: 'Home',
      slug: '',
    },
    {
      name: title,
      slug,
    },
  ];
  const featuredImageObject = {
    url: featuredImage,
    alt: featuredImageAlt,
    width: 672,
    height: 448,
    caption: title,
  };
  const ogImageObject = ogImage
    ? {
        url: ogImage,
        alt: featuredImageAlt,
      }
    : null;
  const ogSquareImageObject = ogSquareImage
    ? {
        url: ogSquareImage,
        alt: featuredImageAlt,
      }
    : null;
  const twitterImageObject = twitterImage
    ? {
        url: twitterImage,
        alt: featuredImageAlt,
      }
    : null;
</script>

<SEO
  article
  {breadcrumbs}
  {slug}
  {title}
  {datePublished}
  {lastUpdated}
  {metadescription}
  {timeToRead}
  featuredImage={featuredImageObject}
  ogImage={ogImageObject}
  ogSquareImage={ogSquareImageObject}
  twitterImage={twitterImageObject}
/>

<BannerImage {imageData} />
<h1>{title}</h1>
<PostViewsLikes
  likes={post.likes}
  views={post.views}
  slug={post.slug}
  comments={post.comments.length}
/>
