<script lang="ts">
  import ViewsIcon from '$lib/components/Icons/View.svelte';
  import LikedIcon from '$lib/components/Icons/HeartSolid.svelte';
  import CommentIcon from '$lib/components/Icons/Comment.svelte';
  import NotYetLikedIcon from '$lib/components/Icons/HeartOutline.svelte';
  import { postLikedViewed } from '$lib/shared/stores/postLikedViewed';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/env';
  import website from '$lib/config/website';
  import {
    container,
    content,
    icon,
    likeButton,
    link,
    meta,
  } from '$lib/components/PostViewsLikesPure.css';

  export let likes: number;
  export let slug: string;
  export let views: number;
  export let comments: number;
  export let containerClass: string = undefined;
  export let contentClass: string = undefined;

  const { workerUrl } = website;

  $: freshLikeCount = null;
  $: freshViewCount = null;
  $: freshCommentCount = null;
  $: displayLikes = freshLikeCount ?? likes;
  $: displayViews = freshViewCount ?? views;
  $: displayComments = freshCommentCount ?? comments;
  let likeButtonHover = false;

  let observer: IntersectionObserver;

  onMount(() => {
    if (browser) {
      const handleIntersect = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver,
      ) => {
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
    }
  });

  onDestroy(() => {
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
    const { id } = likedArray.find((element: { slug: string }) => slug === element.slug);
    return id ? id : '';
  }

  function removeLikeFromStore() {
    const { liked: likedArray, viewed: viewedArray } = JSON.parse($postLikedViewed);
    const index = likedArray.findIndex((element: { slug: string }) => slug === element.slug);
    postLikedViewed.set(
      JSON.stringify({
        liked: [...likedArray.slice(0, index), ...likedArray.slice(index + 1)],
        viewed: viewedArray,
      }),
    );
  }

  $: liked =
    JSON.parse($postLikedViewed).liked.find((element: { slug: string }) => element.slug === slug) !=
    null;
  $: viewed = JSON.parse($postLikedViewed).viewed.includes(slug);

  async function handleLike() {
    try {
      if (browser) {
        const responsePromise = fetch(`${workerUrl}/post/like`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: !liked ? '' : getLikeIdFromStore(),
            slug,
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
      console.error(`Error in handleView: ${error}`);
    }
  }

  $: likeButtonLabel = !liked ? 'Like this blog post' : 'Unlike this blog post';
</script>

<aside class={`${container} ${containerClass ?? ''}`}>
  <div class={`${content} ${contentClass ?? ''}`}>
    <span class={meta}><span class={icon}><ViewsIcon /></span>{displayViews}</span>
    <span class={meta}
      ><span class={icon}>
        <button
          aria-label={likeButtonLabel}
          type="button"
          class={likeButton}
          on:click={handleLike}
          on:mouseenter={() => {
            likeButtonHover = true;
          }}
          on:mouseleave={() => {
            likeButtonHover = false;
          }}
        >
          {#if liked || likeButtonHover}
            <LikedIcon />
          {:else}
            <NotYetLikedIcon />
          {/if}
        </button></span
      >
      {displayLikes}</span
    >
    {#if displayComments > 0}
      <span class={meta}
        ><a aria-label="Jump to comments" class={link} href="#comments"
          ><span class={icon}><CommentIcon /></span>
          {displayComments}</a
        ></span
      >
    {/if}
  </div>
</aside>
