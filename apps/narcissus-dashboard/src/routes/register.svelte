<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ session }) => {
    if (!session.user) {
      return {};
    }

    return {
      status: 301,
      redirect: '/dashboard/',
    };
  };
</script>

<script lang="ts">
  import GithubLogin from '$lib/components/GithubLogin.svelte';
  import {
    EmailInputField,
    PasswordInputField,
    TextInputField,
  } from '@rodneylab/sveltekit-components';
  $: isSubmitting = false;
  let email: string;
  let password: string;
  let username: string;
  let errors = { email: null, password: null, username: null };

  function handleSubmit() {
    console.log({ email, username });
  }
</script>

<svelte:head>
  <title>Register</title>
  <html lang="en-GB" />
  <meta name="description" content="Register for narcissus dashboard to get going." />
</svelte:head>

<h1>Register</h1>
<GithubLogin />
<form on:submit|preventDefault={handleSubmit}>
  <p>Have a password? Continue with your email address.</p>
  <TextInputField
    value={username}
    id="register-username"
    placeholder="blake123"
    title="Username"
    error={errors?.username ?? null}
    on:update={(event) => {
      username = event.detail;
    }}
    style="padding-bottom:1rem"
  />
  <EmailInputField
    value={email}
    id="register-email"
    placeholder="blake@example.com"
    title="Email"
    error={errors?.email ?? null}
    on:update={(event) => {
      email = event.detail;
    }}
    style="padding-bottom:1rem"
  />
  <PasswordInputField
    value={password}
    id="register-password"
    placeholder="p@$Sw0rd"
    title="Password"
    error={errors?.password ?? null}
    on:update={(event) => {
      password = event.detail;
    }}
    style="padding-bottom:1rem"
  />
  <button type="submit" disabled={isSubmitting}>Register with email</button>
</form>
