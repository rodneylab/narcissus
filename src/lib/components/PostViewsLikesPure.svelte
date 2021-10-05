<script>
  import ViewsIcon from '$lib/components/Icons/View.svelte';
  import LikedIcon from '$lib/components/Icons/HeartSolid.svelte';
  import NotYetLikedIcon from '$lib/components/Icons/HeartOutline.svelte';
  import { postLikedViewed } from '$lib/shared/stores/postLikedViewed';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import website from '$lib/config/website';

  export let likes;
  export let slug;
  export let views;

  const { hcaptchaSitekey, workerUrl } = website;

  $: freshLikeCount = null;
  $: freshViewCount = null;
  $: displayLikes = freshLikeCount ?? likes;
  $: displayViews = freshViewCount ?? views;

  let hcaptchaWidgetID;
  let observer;
  let hcaptcha = { execute: async () => {}, render: () => {} };

  onMount(() => {
    if (browser) {
      const handleIntersect = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            handleView();
          }
        });
      };
      const options = { threshold: 1, rootMargin: '100% 0% -100%' };
      observer = new IntersectionObserver(handleIntersect, options);
      const element = window.document.querySelector('main').firstElementChild;
      observer.observe(element);

      hcaptcha = window.hcaptcha;
      if (hcaptcha.render) {
        hcaptchaWidgetID = hcaptcha.render('hcaptcha', {
          sitekey: hcaptchaSitekey,
          size: 'invisible',
          theme: 'dark',
        });
      }
    }
  });

  onDestroy(() => {
    if (browser) {
      hcaptcha = () => {};
    }
    if (observer) {
      observer.disconnect();
    }
  });

  function addLikeToStore({ id }) {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    postLikedViewed.set(
      JSON.stringify({ liked: [{ slug, id }, ...likedArray], viewed: viewedArray }),
    );
  }

  function addViewToStore() {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    postLikedViewed.set(JSON.stringify({ liked: likedArray, viewed: [slug, ...viewedArray] }));
  }

  function getLikeIdFromStore() {
    const { liked: likedArray } = JSON.parse($postLikedViewed);
    const { id } = likedArray.find((element) => slug === element.slug);
    return id ? id : '';
  }

  function removeLikeFromStore() {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    const index = likedArray.findIndex((element) => slug === element.slug);
    postLikedViewed.set(
      JSON.stringify({
        liked: [...likedArray.slice(0, index), ...likedArray.slice(index + 1)],
        viewed: viewedArray,
      }),
    );
  }

  $: liked = JSON.parse($postLikedViewed).liked.find((element) => element.slug === slug) != null;
  $: viewed = JSON.parse($postLikedViewed).viewed.includes(slug);

  async function handleLike() {
    try {
      if (browser) {
        const { response } = await hcaptcha.execute(hcaptchaWidgetID, {
          async: true,
        });
        const responsePromise = fetch(`${workerUrl}/post/like`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: !liked ? '' : getLikeIdFromStore(),
            slug,
            response,
            unlike: liked,
          }),
        });
        const responseResult = await responsePromise;
        const { id, likes } = await responseResult.json();
        if (!liked) {
          addLikeToStore({ id });
        } else {
          removeLikeFromStore();
        }
        freshLikeCount = likes;
      }
    } catch (error) {
      console.error(`Error in handleLike: ${error}`);
    }
  }

  async function handleView() {
    try {
      if (!viewed) {
        const responsePromise = fetch(`${workerUrl}/post/view`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug,
          }),
        });
        addViewToStore();
        const response = await responsePromise;
        const { views } = await response.json();
        freshViewCount = views;
      }
    } catch (error) {
      console.error(`Error in handleLike: ${error}`);
    }
  }

  $: likeButtonLabel = !liked ? 'Like this blog post' : 'Unlike this blog post';
</script>

<svelte:head>
  <script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<ViewsIcon />{displayViews}
<div
  id="hcaptcha"
  class="h-captcha"
  data-sitekey={hcaptchaSitekey}
  data-size="invisible"
  data-theme="dark"
/>
<button aria-label={likeButtonLabel} type="button" on:click={handleLike}>
  {#if liked}
    <LikedIcon />
  {:else}
    <NotYetLikedIcon />
  {/if}
</button>
{displayLikes}
