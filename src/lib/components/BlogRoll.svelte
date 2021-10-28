<script lang="ts">
  import BlogPostSummary from '$lib/components/BlogPostSummary.svelte';
  import { H_ELLIPSIS_ENTITY } from '$lib/constants/entities';

  export let initialPosts: number = 4;
  export let posts: {
    datePublished: string;
    postTitle: string;
    seoMetaDescription: string;
    slug: string;
    likes: number;
    views: number;
    comments: { created_at: string; author: string; text: string }[];
  }[];

  const postCount = posts?.length ?? 0;
  $: showPosts = initialPosts;
  $: displayPosts = posts.slice(0, showPosts);

  const handleClick = () => {
    showPosts += initialPosts;
  };
</script>

<section role="feed">
  <h2>BLOG POSTS</h2>
  {#each displayPosts as post, index}
    <article aria-posinset={index + 1} aria-setsize={postCount}>
      <BlogPostSummary
        datePublished={post.datePublished}
        postTitle={post.postTitle}
        seoMetaDescription={post.seoMetaDescription}
        slug={post.slug}
        likes={post.likes}
        views={post.views}
        comments={post.comments.length}
      />
    </article>
  {:else}
    <p>No posts yet!</p>
  {/each}
  {#if showPosts < postCount}
    <button type="submit" on:click={handleClick}>See more {H_ELLIPSIS_ENTITY}</button>
  {/if}
</section>
