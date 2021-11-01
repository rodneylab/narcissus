<script lang="ts">
  import { browser } from '$app/env';
  import CommentIcon from '$lib/components/Icons/Comment.svelte';
  import NotYetLikedIcon from '$lib/components/Icons/HeartOutline.svelte';
  import LikedIcon from '$lib/components/Icons/HeartSolid.svelte';
  import ViewsIcon from '$lib/components/Icons/View.svelte';
  import {
    container,
    content,
    icon,
    likeButton,
    link,
    meta,
  } from '$lib/components/PostViewsLikesPure.css';
  import website from '$lib/config/website';
  import { postLikedViewed } from '$lib/shared/stores/postLikedViewed';
  import { onDestroy, onMount } from 'svelte';

  export let likes: number;
  export let slug: string;
  export let views: number;
  export let comments: number;
  export let containerClass: string = undefined;
  export let contentClass: string = undefined;
  export let interactive: boolean = true;

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
    if (browser && interactive) {
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
    <span class={meta}><span class={icon}><ViewsIcon label="Views" /></span>{displayViews}</span>
    <span class={meta}
      ><span class={icon}>
        {#if interactive}
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
              <LikedIcon label="likes - already liked by you" />
            {:else}
              <NotYetLikedIcon label="likes - not yet liked by you" />
            {/if}
          </button>
        {:else if liked}
          <LikedIcon label="likes - already liked by you" />
        {:else}
          <NotYetLikedIcon label="likes - not yet liked by you" />
        {/if}
      </span>
      {displayLikes}</span
    >
    {#if displayComments > 0}
      <span class={meta}
        >{#if interactive}
          <a aria-label="Jump to comments" class={link} href="#comments"
            ><span class={icon}><CommentIcon label="comments" /></span>
            {displayComments}</a
          >{:else}
          <span class={icon}><CommentIcon label="comments" /></span>
          {displayComments}
        {/if}</span
      >
    {/if}
  </div>
</aside>
