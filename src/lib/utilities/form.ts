const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function validEmail(email: string) {
  let errors = {};
  if (!emailRegex.test(email)) {
    errors = { ...errors, email: 'Is your email address right?' };
  }
  return errors;
}
