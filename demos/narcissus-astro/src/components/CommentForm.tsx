import React, { useState } from 'react';
import type { FC } from 'react';
import {
  button,
  buttonContainer,
  container,
  content,
  formField,
  formLink,
  heading,
} from './CommentForm.css';
import Card from './Card';
import TextInputField from './TextInputField';
import TextArea from './TextArea';
import { useTheme } from '../hooks/themeContext';
import { ThemeProvider } from '../hooks/themeContext';
import website from '../configuration/website';
import { useForm } from 'react-hook-form';

const ssr = import.meta.env.SSR;

interface CommentFormProps {
  slug: string;
}

const { hcaptchaSitekey, workerUrl } = website;

const CommentForm: FC<CommentFormProps> = function CommentForm({ slug }) {
  const [successfulCommentSubmission, setSuccessfulCommentSubmission] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let hcaptcha;
  let hcaptchaWidgetID: string;

  const {
    state: { theme },
  } = useTheme();

  function clearForm() {
    ['comment', 'name', 'email'].forEach((element) =>
      sessionStorage.removeItem(`${slug}-${element}`),
    );
    name = '';
    email = '';
    comment = '';
  }

  function validateInputs() {
    errors = { ...errors, ...validName(name), ...validEmail(email), ...validComment(comment) };
  }

  const onSubmit = async () => {
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
  };

  return (
    <Card containerClass={container} contentClass={content}>
      <h2 class={heading}>What's your opinion? Leave a comment.</h2>
      {successfulCommentSubmission ? (
        <div>Thanks for your comment. We will review and post it shortly.</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formField}>
            <TextInputField
              id="comment-name"
              placeholder="Blake Costa"
              title="Name"
              required
              errors={errors.Name}
              register={register}
              type="text"
            />
          </div>
          <div className={formField}>
            <TextInputField
              id="comment-email"
              placeholder="blake@example.com"
              title="Email"
              required
              errors={errors.Email}
              register={register}
              type="email"
            />
          </div>
          <div className={formField}>
            <TextArea
              id="comment-comment"
              placeholder="Enter your mesage here"
              title="Comment"
              required
              errors={errors.Message}
              register={register}
            />
          </div>
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
            to Akismet for spam detection. Neither your email address, IP address or user agent is
            stored in our database. This site is protected by
            <a
              aria-label="Learn more about h Captcha"
              class={formLink}
              href="https://www.hCaptcha.com"
            >
              hCaptcha
            </a>
            and its
            <a
              aria-label="Open h Captcha privacy policy"
              class={formLink}
              href="https://www.hcaptcha.com/privacy"
            >
              Privacy Policy
            </a>
            and
            <a
              aria-label="Open hCaptcha terms of service"
              className={formLink}
              href="https://www.hcaptcha.com/terms"
            >
              Terms of Service
            </a>{' '}
            apply.
          </small>
          <div className={buttonContainer}>
            <button type="submit" className={button} disabled={submitting}>
              Leave your comment
            </button>
          </div>
          <div
            id="hcaptcha"
            className="h-captcha"
            data-sitekey={hcaptchaSitekey}
            data-size="invisible"
            data-theme={theme}
          />
        </form>
      )}
    </Card>
  );
};

const ThemeWrapper: FC<{}> = function ThemeWrapper() {
  return (
    <ThemeProvider>
      <CommentForm />
    </ThemeProvider>
  );
};

export default ThemeWrapper;
