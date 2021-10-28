<script lang="ts">
  import website from '$lib/config/website';
  import PostViewsLikesPure from '$lib/components/PostViewsLikesPure.svelte';

  export let likes: number;
  export let views: number;
  export let slug: string;
  export let comments: number;
  export let containerClass: string = undefined;
  export let contentClass: string = undefined;
  export let interactive: boolean = true;

  const { workerUrl } = website;

  async function getViewsLikes() {
    try {
      const url = `${workerUrl}/post/data`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
        }),
      });
      return response.json();
    } catch (error) {
      console.error(`Error in getViewsLikes: ${error}`);
    }
  }

  const likesPromise = getViewsLikes() ?? { likes, views };
</script>

{#await likesPromise}
  <PostViewsLikesPure {containerClass} {contentClass} {slug} {likes} {views} {comments} />
{:then data}
  <PostViewsLikesPure
    {containerClass}
    {contentClass}
    {slug}
    likes={data?.likes ?? likes}
    views={data?.views ?? views}
    comments={data?.comments.length ?? comments}
    {interactive}
  />
{:catch}
  <PostViewsLikesPure {containerClass} {contentClass} {slug} {likes} {views} {comments} />
{/await}
