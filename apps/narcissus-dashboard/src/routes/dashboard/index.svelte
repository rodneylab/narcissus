<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    try {
      const response = await fetch('/api/posts.json');

      if (response.ok) {
        return {
          props: { ...(await response.json()) },
        };
      }
      return {
        props: {},
      };
    } catch (error) {
      console.error(`Error in load function for route /dashboard: ${error}`);
    }
  };
</script>

<svelte:head>
  <title>Register</title>
  <html lang="en-GB" />
  <meta name="description" content="Narcissus dashboard." />
</svelte:head>

<h1>Dashboard</h1>
