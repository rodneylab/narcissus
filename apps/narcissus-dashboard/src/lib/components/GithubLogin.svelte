<script lang="ts">
  import website from '$lib/configuration/website';
  import { supabase } from '$lib/utilities/supabaseClient';

  const { siteUrl } = website;

  async function handleClick() {
    await supabase.auth.signIn({ provider: 'github' }, { redirectTo: `${siteUrl}/github-login/` });
  }
</script>

<button type="submit" on:click={handleClick}>Continue with GitHub</button>
