<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import website from '$lib/config/website';
  import { browser } from '$app/env';
  import Card from '$lib/components/Card.svelte';
  import {
    button,
    buttonContainer,
    container,
    content,
    heading,
  } from '$lib/components/CommentForm.css';
  import { EmailInputField, TextArea, TextInputField } from '@rodneylab/sveltekit-components';
  import { FieldError, validEmail } from '$lib/utilities/form';

  export let slug: string;

  const { hcaptchaSitekey, workerUrl } = website;

  let hcaptchaWidgetID: string;
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

  let errors: { name: FieldError; email: FieldError; comment: FieldError };
  $: errors = { name: null, email: null, comment: null };

  function validateInputs() {
    errors = { ...errors, ...validEmail(email) };
  }

  $: submitting = false;
  $: successfulCommentSubmission = false;

  async function handleSubmit() {
    try {
      validateInputs();
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

<Card containerClass={container} contentClass={content}>
  <h2 class={heading}>What's your opinion? Leave a comment.</h2>
  {#if successfulCommentSubmission}
    <div>Thanks for your comment. We will review and post it shortly.</div>
  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <TextInputField
        value={name}
        id="comment-name"
        placeholder="Blake Costa"
        title="Name"
        error={errors?.email ?? null}
        on:update={(event) => {
          name = event.detail;
        }}
        style="padding-bottom:1.25rem;margin-right:1rem"
      />
      <EmailInputField
        value={email}
        id="contact-email"
        placeholder="blake@example.com"
        title="Email"
        error={errors?.email ?? null}
        on:update={(event) => {
          email = event.detail;
        }}
        style="padding-bottom:1.25rem;margin-right:1rem"
      />
      <TextArea
        value={comment}
        id="contact-message"
        placeholder="Enter your comment here"
        title="Message"
        error={errors?.comment ?? null}
        on:update={(event) => {
          comment = event.detail;
        }}
        style="padding-bottom:1.25rem;margin-right:1rem"
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
        to Akismet for spam detection. Neither your email address, IP address or user agent is stored
        in our database. This site is protected by <a href="https://www.hCaptcha.com">hCaptcha</a>
        and its
        <a href="https://www.hcaptcha.com/privacy">Privacy Policy</a> and
        <a href="https://www.hcaptcha.com/terms">Terms of Service</a> apply.
      </small>
      <div class={buttonContainer}>
        <!-- svelte-ignore component-name-lowercase -->
        <button type="submit" class={button} disabled={submitting}>Leave your comment</button>
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
</Card>
