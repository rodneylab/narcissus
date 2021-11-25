import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import website from '../configuration/website';
import Card from './Card';
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
} from './MessageForm.css';
import TextArea from './TextArea';
import TextInputField from './TextInputField';
import React from 'react';
import { useTheme } from '../hooks/themeContext';
import { ThemeProvider } from '../hooks/themeContext';

// const ssr = import.meta.env.SSR;
const ssr = typeof window === 'undefined';

const { hcaptchaSitekey, workerUrl } = website;

const MessageForm: FC<{}> = function MessageForm() {
  // const [errors, setErrors] = useState(null);
  const [serverState, setServerState] = useState({ ok: true, message: '' });
  const [successfulMessageSubmission, setSuccessfulMessageSubmission] = useState<boolean>(false);
  // const [name, setName] = useState(ssr ? '' : window.sessionStorage.getItem('contact-name') ?? '');
  // const [email, setEmail] = useState(
  //   ssr ? '' : window.sessionStorage.getItem('contact-email') ?? '',
  // );
  // const [message, setMessage] = useState(
  //   ssr ? '' : window.sessionStorage.getItem('contact-message') ?? '',
  // );
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

  // const darkMode = ssr
  //   ? false
  //   : window?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;

  useEffect(() => {
    if (!ssr) {
      hcaptcha = window.hcaptcha;
      if (hcaptcha.render) {
        hcaptchaWidgetID = hcaptcha.render('hcaptcha', {
          sitekey: hcaptchaSitekey,
          size: 'invisible',
          theme,
        });
      }
    }

    return () => {
      hcaptcha = null;
    };
  }, []);

  function clearForm() {
    ['message', 'name', 'email'].forEach((element) =>
      sessionStorage.removeItem(`comment-${element}`),
    );
    // setName('');
    // setEmail('');
    // setMessage('');
  }

  function sessionStore(field: string, value: string) {
    if (!ssr) {
      window.sessionStorage.setItem(`contact-${field}`, value);
    }
  }

  const validateInputs = () => {
    // setErrors({ ...errors, ...validName(name), ...validEmail(email), ...validMessage(message) });
  };

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

  const onSubmit = async () => {
    try {
      validateInputs();
      if (noErrors()) {
        // setSubmitting(true);
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
            // name,
            // text: message,
            // email,
            response,
          }),
        });
        await responsePromise;
        clearForm();
        setSuccessfulMessageSubmission(true);
      }
    } catch (error) {
      console.error(`Error in MessageForm, handleSubmit: ${error}`);
    }
  };
  return (
    <Card containerClass={container} contentClass={content}>
      <h2 className={heading}>Drop me a message</h2>
      {successfulMessageSubmission ? (
        <div>Thanks for your message. I normally respond within one working day.</div>
      ) : (
        <form className={form} onSubmit={handleSubmit(onSubmit)}>
          <div className={formField}>
            <TextInputField
              id="contact-name"
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
              id="comment-message"
              placeholder="Enter your mesage here"
              title="Message"
              required
              errors={errors.Message}
              register={register}
            />
          </div>
          <small className={disclaimer}>
            This site uses Akismet to reduce spam.
            <a
              aria-label="Learn how Akismet process message data"
              className={formLink}
              href="https://akismet.com/privacy/"
            >
              Learn how your message data is processed
            </a>
            . We pass your message, name, email, IP address and{' '}
            <a
              aria-label="Learn more about browser user agent from M D N"
              className={formLink}
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent"
            >
              browser user agent
            </a>{' '}
            to Akismet for spam detection. Neither your IP address nor user agent is stored in our
            database. This site is protected by
            <a
              aria-label="Learn more about h Captcha"
              className={formLink}
              href="https://www.hCaptcha.com"
            >
              hCaptcha
            </a>
            and its
            <a
              aria-label="View h Captcha privacy policy"
              className={formLink}
              href="https://www.hcaptcha.com/privacy"
            >
              Privacy Policy
            </a>
            and
            <a
              aria-label="View h Captcha terms of service"
              className={formLink}
              href="https://www.hcaptcha.com/terms"
            >
              Terms of Service
            </a>{' '}
            apply.
          </small>
          <div className={buttonContainer}>
            <button type="submit" className={button} disabled={submitting}>
              Send your message
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
// export { MessageForm as default };

const ThemeWrapper: FC<{}> = function ThemeWrapper() {
  return (
    <ThemeProvider>
      <MessageForm />
    </ThemeProvider>
  );
};

export default ThemeWrapper;
