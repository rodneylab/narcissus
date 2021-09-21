<script>
  import website from '$lib/config/website';
  import PostViewsLikesPure from '$lib/components/PostViewsLikesPure.svelte';

  export let likes;
  export let views;
  export let slug;

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
      console.error(`Error in getLikes: ${error}`);
    }
  }

  const likesPromise = getViewsLikes() ?? { likes, views };
</script>

{#await likesPromise}
  <PostViewsLikesPure {slug} {likes} {views} />
{:then data}
  <PostViewsLikesPure {slug} likes={data?.likes ?? likes} views={data?.views ?? views} />
{:catch}
  <PostViewsLikesPure {slug} {likes} {views} />
{/await}
