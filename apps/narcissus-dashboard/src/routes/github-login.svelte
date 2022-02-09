<script lang="ts">
  import { browser } from '$app/env';

  if (browser) {
    const locationHash = new URLSearchParams(window.location.hash.slice(1));
    // const accessToken = locationHash.get('access_token');
    const refreshToken = locationHash.get('refresh_token');
    const providerToken = locationHash.get('provider_token');

    async function handleLogin() {
      try {
        await fetch('/api/github-login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          // body: JSON.stringify({ accessToken, providerToken, refreshToken }),
          body: JSON.stringify({ providerToken, refreshToken }),
        });
        window.location.replace('/complete-login');
      } catch (error) {
        console.error(`Error on /github-login route: ${error}`);
      }
    }
    handleLogin();
  }
</script>
