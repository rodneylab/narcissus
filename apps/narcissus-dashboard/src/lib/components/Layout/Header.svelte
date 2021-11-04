<script lang="ts">
  import { goto, prefetch } from '$app/navigation';
  import { session } from '$app/stores';

  $: user = $session.user ?? null;
  $: isGuest = !user;

  async function handleLogout() {
    session.set({ user: null });
    await prefetch('/logout');
    await goto('/logout');
  }
</script>

<header>
  <div><a aria-label="Go to narcissus home" href="/">Narcissus</a></div>
  {#if isGuest}
    <a aria-label="Log in" href="/login/">Login</a>
    <a aria-label="Register" href="/register/">Register</a>
  {:else}
    <a aria-label="Jump to dashboard" href="/dashboard/">dashboard</a>
    <div>{user}</div>
    <button type="button" on:click={handleLogout}>Logout</button>
  {/if}
</header>
