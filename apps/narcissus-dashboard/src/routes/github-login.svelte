<script lang="ts">
  import { browser } from '$app/env';
  import { goto, prefetch } from '$app/navigation';

  if (browser) {
    const locationHash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = locationHash.get('access_token');
    const refreshToken = locationHash.get('refresh_token');
    const providerToken = locationHash.get('provider_token');

    async function handleLogin() {
      try {
        await fetch('/api/github-login', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken, providerToken, refreshToken }),
        });
        await prefetch('/dashboard');
        await goto('/dashboard');
      } catch (error) {
        console.log(`Error on /github-login route: ${error}`);
      }
    }
    handleLogin();
  }
</script>
