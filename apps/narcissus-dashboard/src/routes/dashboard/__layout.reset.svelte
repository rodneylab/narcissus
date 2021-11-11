<script context="module">
  export function load({ session }) {
    if (!session.user) {
      return {
        redirect: '/',
        status: 302,
      };
    }
    return {};
  }
</script>

<script>
  import Header from '$lib/components/Layout/Header.svelte';
</script>

<Header />
<main><slot /></main>
