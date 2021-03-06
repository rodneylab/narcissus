<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ params, fetch, url }) {
    const { pathname } = url;

    // make sure this is not a blog post
    if (pathname === '/') {
      const endpoint = './index.json';
      const response = await fetch(endpoint);

      if (response.ok) {
        return {
          props: { ...(await response.json()), post: null, slug: '/' },
        };
      }

      return {};
    } else if (pathname === '/contact') {
      return { props: { post: null, slug: '/contact' } };
    }

    const { slug } = params;
    const endpoint =
      pathname[pathname.length - 1] === '/'
        ? `${pathname.slice(0, -1)}.json`
        : `${pathname.path}.json`;
    const res = await fetch(endpoint);

    if (res.ok) {
      const imageData = await import(`../lib/generated/posts/${pathname.slice(1)}.js`);
      return {
        props: { ...(await res.json()), slug, imageData: { ...imageData.default } },
      };
    }

    return {};
  }
</script>

<script lang="ts">
  import { browser } from '$app/env';
  import BlogPost from '$lib/components/BlogPost.svelte';
  import CommentForm from '$lib/components/CommentForm.svelte';
  import Comments from '$lib/components/Comments.svelte';
  import Footer from '$lib/components/Layout/Footer.svelte';
  import Header from '$lib/components/Layout/Header.svelte';
  import PostViewsLikes from '$lib/components/PostViewsLikes.svelte';
  import PWA from '$lib/components/PWA.svelte';
  import theme from '$lib/shared/stores/theme';
  import '$lib/styles/normalise.css';
  import '$lib/styles/styles.css';
  import { darkTheme } from '$lib/styles/themes/dark.css';
  import { lightTheme } from '$lib/styles/themes/light.css';
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
  import lazyload from 'vanilla-lazyload';
  import { container, main } from './layout.css';

  export let post: {
    datePublished: string;
    featuredImageAlt: string;
    lastUpdated: string;
    postTitle: string;
    seoMetaDescription: string;
    body: string;
    likes: number;
    views: number;
    comments: { created_at: string; author: string; text: string }[];
    slug: string;
  };
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
  export let slug: string;

  if (browser && !document.lazyloadInstance) {
    document.lazyloadInstance = new lazyload();
  }

  $: isBlogPost = post != null;
  $: lightThemeActive = $theme === 'light';
  $: containerClass = `${container} ${lightThemeActive ? lightTheme : darkTheme}`;
</script>

<PWA />
<div class={containerClass}>
  <Header {slug} />
  <!-- svelte-ignore component-name-lowercase -->
  <main class={main}>
    {#if isBlogPost}
      <BlogPost {post} {imageData} />
      <slot />
      <PostViewsLikes
        likes={post.likes}
        views={post.views}
        slug={post.slug}
        comments={post.comments.length}
      />
      <CommentForm slug={post.slug} />
      <Comments comments={post.comments} />
    {:else}
      <slot />
    {/if}
  </main>
  <Footer />
</div>
