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
    formLink,
    heading,
  } from '$lib/components/CommentForm.css';
  import { EmailInputField, TextArea, TextInputField } from '@rodneylab/sveltekit-components';
  import { FieldError, validEmail, validComment } from '$lib/utilities/form';
  import type { HCaptchaExecuteResponse } from 'src/global';

  export let slug: string;

  const { hcaptchaSitekey, workerUrl } = website;

  let hcaptchaWidgetID: string;
  let hcaptcha: {
    execute(hcaptchaWidgetID: string, opts?: { async: boolean }): Promise<HCaptchaExecuteResponse>;
    render(id: string, config: { sitekey: string; size: string; theme: string }): string;
  } | null;

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
      hcaptcha = null;
    }
  });

  let comment = browser ? window.sessionStorage.getItem(`${slug}-comment`) ?? '' : '';
  let name = browser ? window.sessionStorage.getItem(`${slug}-name`) ?? '' : '';
  let email = browser ? window.sessionStorage.getItem(`${slug}-email`) ?? '' : '';

  let errors: { name?: FieldError; email?: FieldError; comment?: FieldError };
  // $: errors = { name: null, email: null, comment: null };
  $: errors = null;

  function clearForm() {
    ['comment', 'name', 'email'].forEach((element) =>
      sessionStorage.removeItem(`${slug}-${element}`),
    );
    name = '';
    email = '';
    comment = '';
  }

  function sessionStore(field: string, value: string) {
    if (browser) {
      window.sessionStorage.setItem(`${slug}-${field}`, value);
    }
  }

  function validateInputs() {
    errors = { ...errors, ...validEmail(email), ...validComment(comment) };
  }

  function noErrors() {
    validateInputs();
    if (errors == null) {
      return true;
    }
    const { name: nameError, email: emailError, comment: commentError } = errors;
    if (!nameError && !emailError && !commentError) {
      return true;
    }
    return false;
  }

  $: submitting = false;
  $: successfulCommentSubmission = false;

  async function handleSubmit() {
    try {
      validateInputs();
      if (noErrors() && browser) {
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
        clearForm();
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
          sessionStore('name', event.detail);
          name = event.detail;
        }}
        style="padding-bottom:1.25rem;margin-right:1rem"
      />
      <EmailInputField
        value={email}
        id="comment-email"
        placeholder="blake@example.com"
        title="Email"
        error={errors?.email ?? null}
        on:update={(event) => {
          sessionStore('email', event.detail);
          email = event.detail;
        }}
        style="padding-bottom:1.25rem;margin-right:1rem"
      />
      <TextArea
        value={comment}
        id="comment-comment"
        placeholder="Enter your comment here"
        title="Comment"
        error={errors?.comment ?? null}
        on:update={(event) => {
          sessionStore('comment', event.detail.trim());
          comment = event.detail.trim();
        }}
        style="padding-bottom:1.25rem;margin-right:1rem"
      />
      <small>
        This site uses Akismet to reduce spam.{' '}
        <a
          aria-label="Learn how Akismet process comment data"
          class={formLink}
          href="https://akismet.com/privacy/"
        >
          Learn how your comment data is processed
        </a>
        . We pass your comment, name, email, IP address and{' '}
        <a
          aria-label="Learn more about browser user agent from M D N"
          class={formLink}
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
        >
          browser user agent
        </a>{' '}
        to Akismet for spam detection. Neither your email address, IP address or user agent is stored
        in our database. This site is protected by
        <a aria-label="Learn more about h Captcha" class={formLink} href="https://www.hCaptcha.com"
          >hCaptcha</a
        >
        and its
        <a
          aria-label="Open h Captcha privacy policy"
          class={formLink}
          href="https://www.hcaptcha.com/privacy">Privacy Policy</a
        >
        and
        <a
          aria-label="Open hCaptcha terms of service"
          class={formLink}
          href="https://www.hcaptcha.com/terms">Terms of Service</a
        > apply.
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
