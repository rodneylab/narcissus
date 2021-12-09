import { container, input } from '$components/TextInputField.css';
import { screenReaderText } from '$styles/styles.css';
import type { JSX } from 'react';

interface TextInputFieldProps {
  id: string;
  maxLength?: number;
  pattern?: RegExp;
  register: () => {};
  required?: boolean;
  errors: Record<string, string>;
  type: string;
  placeholder: string;
  title: string;
}

const TextInputField = function TextInputField({
  id,
  maxLength,
  pattern,
  placeholder,
  register,
  required,
  errors,
  type,
  title,
}: TextInputFieldProps): JSX.Element {
  return (
    <div className={container}>
      <label htmlFor={id} className={screenReaderText}>
        {title}
      </label>
      <input
        id={id}
        aria-describedby={errors ? `${id}-error` : null}
        aria-invalid={!!errors}
        aria-required={required}
        className={input}
        placeholder={placeholder}
        type={type}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register(title, { maxLength, pattern, required })}
      />
      {errors ? (
        <span>
          <small>Please let us know your name, it will appear along with your comment.</small>
        </span>
      ) : null}
    </div>
  );
};

TextInputField.defaultProps = {
  maxLength: 64,
  pattern: null,
  required: false,
};

export default TextInputField;
