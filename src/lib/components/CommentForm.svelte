<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import website from '$lib/config/website';
  import { browser } from '$app/env';

  export let slug;

  const { hcaptchaSitekey, workerUrl } = website;

  let hcaptchaWidgetID;
  let hcaptcha;

  const darkMode =
    browser && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  onMount(() => {
    if (browser) {
      hcaptcha = window.hcaptcha;
      if (hcaptcha.render) {
        hcaptchaWidgetID = hcaptcha.render('hcaptcha', {
          sitekey: hcaptchaSitekey,
          size: 'invisible',
          theme: darkMode ? 'dark' : 'light',
        });
      }
    }
  });

  onDestroy(() => {
    if (browser) {
      hcaptcha = () => {};
    }
  });

  let comment = '';
  let name = '';
  let email = '';

  $: submitting = false;
  $: successfulCommentSubmission = false;

  async function handleSubmit() {
    try {
      if (browser) {
        submitting = true;
        const { response } = await hcaptcha.execute(hcaptchaWidgetID, {
          async: true,
        });
        const responsePromise = fetch(`${workerUrl}/post/comment`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: name,
            text: comment,
            email,
            response,
            slug,
          }),
        });
        await responsePromise;
        submitting = false;
        successfulCommentSubmission = true;
      }
    } catch (error) {
      console.error(`Error in CommentForm, handleSubmit: ${error}`);
    }
  }
</script>

<svelte:head>
  <script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

{#if successfulCommentSubmission}
  <div>Thanks for your comment. We will review and post it shortly.</div>
{:else}
  <form on:submit|preventDefault={handleSubmit}>
    <span class="screen-reader-text"><label for="comment-name">Name</label></span>
    <input
      bind:value={name}
      required
      id="comment-name"
      placeholder="Name"
      title="Name"
      type="text"
    />
    <span class="screen-reader-text"><label for="comment-email">Email</label></span>
    <input
      bind:value={email}
      required
      id="comment-email"
      placeholder="email@me.com"
      title="Email"
      type="email"
    />
    <span class="screen-reader-text"><label for="comment-content">Comment</label></span>
    <textarea
      bind:value={comment}
      required
      id="comment-content"
      placeholder="Write your comment here"
      rows="10"
      spellcheck="true"
      title="Comment"
      type="text"
    />
    <small>
      This site uses Akismet to reduce spam.{' '}
      <a aria-label="Learn how Akismet process comment data" href="https://akismet.com/privacy/">
        Learn how your comment data is processed
      </a>
      . We pass your comment, name, email, IP address and{' '}
      <a
        aria-label="Learn more about browser user agent from M D N"
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
      >
        browser user agent
      </a>{' '}
      to Akismet for spam detection. Neither your email address, IP address or user agent is stored in
      our database.
    </small>
    <div>
      <button type="submit" disabled={submitting}>Submit your comment</button>
    </div>
    <div
      id="hcaptcha"
      class="h-captcha"
      data-sitekey={hcaptchaSitekey}
      data-size="invisible"
      data-theme="dark"
    />
  </form>
{/if}
