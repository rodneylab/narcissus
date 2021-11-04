<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async () => {
    await fetch('/api/logout', {
      method: 'GET',
      credentials: 'same-origin',
    });

    return {
      status: 301,
      redirect: '/',
    };
  };
</script>
