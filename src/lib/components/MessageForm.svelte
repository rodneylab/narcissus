<script lang="ts">
  import { browser } from '$app/env';
  import Card from '$lib/components/Card.svelte';
  import { button, container, content, formLink, heading } from '$lib/components/MessageForm.css';
  import website from '$lib/config/website';
  import { validEmail } from '$lib/utilities/form';
  import { EmailInputField, TextArea, TextInputField } from '@rodneylab/sveltekit-components';
  import { onDestroy, onMount } from 'svelte';

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

  let message = '';
  let name = '';
  let email = '';

  type FieldError = string | null;
  let errors: { name: FieldError; email: FieldError; message: FieldError };
  $: errors = { name: null, email: null, message: null };

  function validateInputs() {
    errors = { ...errors, ...validEmail(email) };
  }

  $: submitting = false;
  $: successfulMessageSubmission = false;

  async function handleSubmit() {
    try {
      validateInputs();
      if (browser) {
        submitting = true;
        const { response } = await hcaptcha.execute(hcaptchaWidgetID, {
          async: true,
        });
        const responsePromise = fetch(`${workerUrl}/post/message`, {
          method: 'POST',
          credentials: 'omit',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            text: message,
            email,
            response,
          }),
        });
        await responsePromise;
        submitting = false;
        successfulMessageSubmission = true;
      }
    } catch (error) {
      console.error(`Error in MessageForm, handleSubmit: ${error}`);
    }
  }
</script>

<svelte:head>
  <script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<Card containerClass={container} contentClass={content}>
  <h2 class={heading}>Drop me a message</h2>
  {#if successfulMessageSubmission}
    <div>Thanks for your message. I normally respond within one working day.</div>
  {:else}
    <form on:submit|preventDefault={handleSubmit}>
      <TextInputField
        value={name}
        id="contact-name"
        placeholder="Blake Costa"
        title="Name"
        error={errors?.email ?? null}
        on:update={(event) => {
          name = event.detail;
        }}
        style="padding-bottom:1.25rem"
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
        style="padding-bottom:1.25rem"
      />
      <TextArea
        value={message}
        id="contact-message"
        placeholder="Enter your message here"
        title="Message"
        error={errors?.message ?? null}
        on:update={(event) => {
          message = event.detail;
        }}
        style="padding-bottom:1.25rem"
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
        in our database.
      </small>
      <div>
        <!-- svelte-ignore component-name-lowercase -->
        <button type="submit" class={button} disabled={submitting}>Send your message</button>
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
