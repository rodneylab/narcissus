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

  const { hcaptchaSitekey } = website;

  $: freshLikeCount = null;
  $: freshViewCount = null;
  $: displayLikes = freshLikeCount ?? likes;
  $: displayViews = freshViewCount ?? views;

  let observer;

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

      hcaptchaWidgetID = window.hcaptcha.render('hcaptcha', {
        sitekey: hcaptchaSitekey,
        size: 'invisible',
      });
    }
  });

  onDestroy(() => {
    if (browser) {
    }
    if (observer) {
      observer.disconnect();
    }
  });

  function addLikeToStore() {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    postLikedViewed.set(JSON.stringify({ liked: [slug, ...likedArray], viewed: viewedArray }));
  }

  function addViewToStore() {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    postLikedViewed.set(JSON.stringify({ liked: likedArray, viewed: [slug, ...viewedArray] }));
  }

  function removeLikeFromStore() {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    const index = likedArray.findIndex((element) => slug === element);
    postLikedViewed.set(
      JSON.stringify({
        liked: [...likedArray.slice(0, index), ...likedArray.slice(index + 1)],
        viewed: viewedArray,
      }),
    );
  }

  $: liked = JSON.parse($postLikedViewed).liked.includes(slug);
  $: viewed = JSON.parse($postLikedViewed).viewed.includes(slug);

  async function handleLike() {
    try {
      const { token, key } = await window.hcaptcha.execute(hcaptchaWidgetID, { async: true });
      const responsePromise = fetch('/api/post/like.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          key,
          token,
          unlike: liked,
        }),
      });
      if (!liked) {
        addLikeToStore();
      } else {
        removeLikeFromStore();
      }
      const response = await responsePromise;
      const { likes } = await response.json();
      freshLikeCount = likes;
    } catch (error) {
      console.error(`Error in handleLike: ${error}`);
    }
  }

  async function handleView() {
    try {
      if (!viewed) {
        const responsePromise = fetch('/api/post/view.json', {
          method: 'POST',
          credentials: 'same-origin',
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
<div id="hcaptcha" class="h-captcha" data-sitekey={hcaptchaSitekey} data-size="invisible" />
<button aria-label={likeButtonLabel} type="button" on:click={handleLike}>
  {#if liked}
    <LikedIcon />
  {:else}
    <NotYetLikedIcon />
  {/if}
</button>
{displayLikes}
