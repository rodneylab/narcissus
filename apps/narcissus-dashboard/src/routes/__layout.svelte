<script context="module" lang="ts">
  export async function load({ session }) {
    if (session.user) {
      return {
        redirect: '/dashboard',
        status: 302,
      };
    }
    return { props: {} };
  }
</script>

<script lang="ts">
  import Footer from '$lib/components/Layout/Footer.svelte';
  import PWA from '$lib/components/PWA.svelte';
  import Header from '$lib/components/Layout/Header.svelte';
</script>

<PWA />
<Header />
<main><slot /></main>
<Footer />
