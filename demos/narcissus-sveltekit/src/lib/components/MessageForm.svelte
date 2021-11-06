<script lang="ts">
  import { browser } from '$app/env';
  import Card from '$lib/components/Card.svelte';
  import {
    button,
    buttonContainer,
    container,
    content,
    disclaimer,
    form,
    formField,
    formLink,
    heading,
  } from '$lib/components/MessageForm.css';
  import website from '$lib/config/website';
  import theme from '$lib/shared/stores/theme';
  import type { FieldError } from '$lib/utilities/form';
  import { validEmail, validMessage, validName } from '$lib/utilities/form';
  import { EmailInputField, TextArea, TextInputField } from '@rodneylab/sveltekit-components';
  import type { HCaptchaExecuteResponse } from 'src/global';
  import { onDestroy, onMount } from 'svelte';

  const { hcaptchaSitekey, workerUrl } = website;

  let hcaptchaWidgetID: string;
  let hcaptcha: {
    execute(hcaptchaWidgetID: string, opts?: { async: boolean }): Promise<HCaptchaExecuteResponse>;
    render(id: string, config: { sitekey: string; size: string; theme: string }): string;
  } | null;

  onMount(() => {
    if (browser) {
      hcaptcha = window.hcaptcha;
      if (hcaptcha.render) {
        hcaptchaWidgetID = hcaptcha.render('hcaptcha', {
          sitekey: hcaptchaSitekey,
          size: 'invisible',
          theme: $theme,
        });
      }
    }
  });

  onDestroy(() => {
    if (browser) {
      hcaptcha = null;
    }
  });

  let message = browser ? window.sessionStorage.getItem('contact-message') ?? '' : '';
  let name = browser ? window.sessionStorage.getItem('contact-name') ?? '' : '';
  let email = browser ? window.sessionStorage.getItem('contact-email') ?? '' : '';

  let errors: { name: FieldError; email: FieldError; message: FieldError };
  $: errors = { name: null, email: null, message: null };

  function clearForm() {
    ['message', 'name', 'email'].forEach((element) =>
      sessionStorage.removeItem(`comment-${element}`),
    );
    name = '';
    email = '';
    message = '';
  }

  function sessionStore(field: string, value: string) {
    if (browser) {
      window.sessionStorage.setItem(`contact-${field}`, value);
    }
  }

  function validateInputs() {
    errors = { ...errors, ...validName(name), ...validEmail(email), ...validMessage(message) };
  }

  function noErrors() {
    validateInputs();
    if (errors == null) {
      return true;
    }
    const { name: nameError, email: emailError, message: messageError } = errors;
    if (!nameError && !emailError && !messageError) {
      return true;
    }
    return false;
  }

  $: submitting = false;
  $: successfulMessageSubmission = false;

  async function handleSubmit() {
    try {
      validateInputs();
      if (noErrors() && browser) {
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
        clearForm();
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
    <!-- svelte-ignore component-name-lowercase -->
    <form class={form} on:submit|preventDefault={handleSubmit}>
      <div class={formField}>
        <TextInputField
          value={name}
          id="contact-name"
          placeholder="Blake Costa"
          title="Name"
          required
          error={errors?.name ?? null}
          on:update={(event) => {
            const value = event.detail.trim();
            sessionStore('name', value);
            name = value;
          }}
          style="padding-bottom:1.25rem;margin-right:1rem"
        />
      </div>
      <div class={formField}>
        <EmailInputField
          value={email}
          id="contact-email"
          placeholder="blake@example.com"
          title="Email"
          required
          error={errors?.email ?? null}
          on:update={(event) => {
            const value = event.detail.trim();
            sessionStore('email', event.detail);
            email = event.detail;
          }}
          style="padding-bottom:1.25rem;margin-right:1rem"
        />
      </div>
      <div class={formField}>
        <TextArea
          value={message}
          id="contact-message"
          placeholder="Enter your message here"
          title="Message"
          required
          error={errors?.message ?? null}
          on:update={(event) => {
            const value = event.detail.trim();
            sessionStore('message', value);
            message = value;
          }}
          style="padding-bottom:1.25rem;margin-right:1rem"
        />
      </div>
      <small class={disclaimer}>
        This site uses Akismet to reduce spam.{' '}
        <a
          aria-label="Learn how Akismet process comment data"
          class={formLink}
          href="https://akismet.com/privacy/"
        >
          Learn how your message data is processed
        </a>
        . We pass your message, name, email, IP address and{' '}
        <a
          aria-label="Learn more about browser user agent from M D N"
          class={formLink}
          href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
        >
          browser user agent
        </a>{' '}
        to Akismet for spam detection. Neither your IP address nor user agent is stored in our database.
        This site is protected by
        <a aria-label="Learn more about h Captcha" class={formLink} href="https://www.hCaptcha.com"
          >hCaptcha</a
        >
        and its
        <a
          aria-label="View h Captcha privacy policy"
          class={formLink}
          href="https://www.hcaptcha.com/privacy">Privacy Policy</a
        >
        and
        <a
          aria-label="View h Captcha terms of service"
          class={formLink}
          href="https://www.hcaptcha.com/terms">Terms of Service</a
        > apply.
      </small>
      <div class={buttonContainer}>
        <!-- svelte-ignore component-name-lowercase -->
        <button type="submit" class={button} disabled={submitting}>Send your message</button>
      </div>
      <div
        id="hcaptcha"
        class="h-captcha"
        data-sitekey={hcaptchaSitekey}
        data-size="invisible"
        data-theme={$theme}
      />
    </form>
  {/if}
</Card>
