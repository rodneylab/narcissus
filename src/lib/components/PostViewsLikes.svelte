<script>
  import ViewsIcon from '$lib/components/Icons/View.svelte';
  import LikedIcon from '$lib/components/Icons/HeartSolid.svelte';
  import NotYetLikedIcon from '$lib/components/Icons/HeartOutline.svelte';
  import { postViewsLikes } from '$lib/shared/stores/postViewsLikes';

  export let likes;
  export let views;
  export let slug;
  $: liked = $postViewsLikes.includes(slug);

  async function getLikes() {
    try {
      const response = await fetch('/api/post/data.json', {
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
  const likesPromise = getLikes();

  async function handleLike() {
    try {
      await fetch('/api/post/like.json', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          unlike: liked,
        }),
      });
      const likedArray = JSON.parse($postViewsLikes);
      if (!liked) {
        postViewsLikes.set(JSON.stringify([...likedArray, slug]));
      } else {
        const likedArray = JSON.parse($postViewsLikes);
        const thisPostIndex = likedArray.findIndex(slug);
        postViewsLikes.set(
          JSON.stringify([
            ...likedArray.slice(0, thisPostIndex),
            ...likedArray.slice(thisPostIndex + 1),
          ]),
        );
      }
    } catch (error) {
      console.error(`Error in handleLike: ${error}`);
    }
  }
</script>

<ViewsIcon />{views}
{#if liked}
  <LikedIcon />
{:else}
  <button aria-label="Like this blog post" type="button" on:click={handleLike}
    ><NotYetLikedIcon /></button
  >
{/if}
{#await likesPromise}
  {likes}
{:then updatedLikes}
  {updatedLikes.count ?? likes}
{:catch}
  {likes}
{/await}
