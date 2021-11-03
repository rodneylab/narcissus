const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validComment(comment: string) {
  let errors = {};
  if (comment.length === 0) {
    errors = { ...errors, comment: "Don't forget to leave a comment!" };
  }
  if (comment.length > 1024) {
    errors = { ...errors, comment: 'Your comment looks a little long!' };
  }
  return errors;
}

export function validEmail(email: string) {
  let errors = {};
  if (!emailRegex.test(email)) {
    errors = { ...errors, email: 'Is your email address right?' };
  }
  return errors;
}

export function validMessage(message: string) {
  let errors = {};
  if (message.length === 0) {
    errors = { ...errors, message: "Don't forget to leave a message!" };
  }
  if (message.length > 1024) {
    errors = { ...errors, message: 'Your message looks a little long!' };
  }
  return errors;
}

export function validName(message: string) {
  let errors = {};
  if (message.length === 0) {
    errors = { ...errors, name: "Don't forget to tell us your name!" };
  }
  return errors;
}

export type FieldError = string | null;
