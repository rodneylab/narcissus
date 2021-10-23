<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch }) {
    const { path } = page;

    // make sure this is not a blog post
    if (path === '/') {
      const url = './index.json';
      const response = await fetch(url);

      if (response.ok) {
        return {
          props: { ...(await response.json()), post: null },
        };
      }

      return {};
    } else if (path === '/contact') {
      return { props: { post: null } };
    }

    const { slug } = page.params;
    const url =
      page.path[page.path.length - 1] === '/'
        ? `${page.path.slice(0, -1)}.json`
        : `${page.path}.json`;
    const res = await fetch(url);

    if (res.ok) {
      const imageData = await import(`../lib/generated/posts/${path.slice(1)}.js`);
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
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import PostViewsLikes from '$lib/components/PostViewsLikes.svelte';
  import PWA from '$lib/components/PWA.svelte';
  import '$lib/styles/normalise.css';
  import '$lib/styles/styles.css';
  import { lightTheme } from '$lib/styles/themes/light.css';
  import '@fontsource/lato/400.css';
  import '@fontsource/lora/600.css';
  import '@fontsource/lora/700-italic.css';
  import '@fontsource/lora/700.css';
  import '@fontsource/slabo-27px';
  import '@fontsource/source-sans-pro/400-italic.css';
  import lazyload from 'vanilla-lazyload';
  import { container, main } from './layout.css';

  export let post, imageData;

  if (browser && !document.lazyloadInstance) {
    document.lazyloadInstance = new lazyload();
  }

  $: isBlogPost = post != null;
</script>

<PWA />
<div class={`${container} ${lightTheme}`}>
  <Header />
  <!-- svelte-ignore component-name-lowercase -->
  <main class={main}>
    {#if isBlogPost}
      <BlogPost {post} {imageData} />
      <slot />
      <PostViewsLikes likes={post.likes} views={post.views} slug={post.slug} />
      <div>
        <a href="https://hcaptcha.com/privacy">Privacy Policy</a> and
        <a href="https://hcaptcha.com/terms">Terms of Service</a> apply.
      </div>
      <CommentForm slug={post.slug} />
      <Comments comments={post.comments} />
    {:else}
      <slot />
    {/if}
  </main>
  <Footer />
</div>
