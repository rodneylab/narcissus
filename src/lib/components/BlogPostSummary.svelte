<script lang="ts">
  import dayjs from 'dayjs';
  import { H_ELLIPSIS_ENTITY } from '$lib/constants/entities';
  import { goto, prefetch } from '$app/navigation';
  import {
    container,
    content,
    contentBody,
    contentHeading,
    contentHeadingContainer,
    dateText,
    postMeta,
    viewsLikesContainer,
    viewsLikesContent,
  } from './BlogPostSummary.css';
  import PostViewsLikes from './PostViewsLikes.svelte';

  export let postTitle: string;
  export let datePublished: string;
  export let seoMetaDescription: string;
  export let slug: string;
  export let likes: number;
  export let views: number;
  export let comments: number;

  const handleMouseEnter = (event: MouseEvent) => {
    event.target.style.cursor = 'pointer';
  };

  const handleMouseLeave = (event: MouseEvent) => {
    event.target.style.cursor = 'default';
  };

  const handleMouseDown = async () => {
    await prefetch(`/${slug}`);
    goto(`/${slug}`);
  };

  const date = dayjs(datePublished);
  const dateString = `${date.format('D')} ${date.format('MMM')}`;
  const idString = `blog-post-summary-${slug}`;
</script>

<div
  class={container}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:mousedown={handleMouseDown}
>
  <div class={content}>
    <h3 class={contentHeadingContainer}>
      <a
        aria-label={`Open ${postTitle} blog post`}
        aria-describedby={idString}
        class={contentHeading}
        sveltekit:prefetch
        href={`/${slug}/`}>{postTitle}</a
      >
    </h3>
    <section class={contentBody}>
      <div class={postMeta}>
        <div class={dateText}>{dateString}</div>
        <PostViewsLikes
          containerClass={viewsLikesContainer}
          contentClass={viewsLikesContent}
          {likes}
          {views}
          {comments}
          {slug}
          interactive={false}
        />
      </div>
      <p>{seoMetaDescription}</p>
      <span id={idString} aria-hidden="true">Read more {H_ELLIPSIS_ENTITY}</span>
    </section>
  </div>
</div>
