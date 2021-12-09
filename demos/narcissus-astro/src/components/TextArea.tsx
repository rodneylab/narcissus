import { container, input } from '$components/TextArea.css';
import { screenReaderText } from '$styles/styles.css';
import type { JSX } from 'react';

interface TextAreaProps {
  id: string;
  rows?: number;
  maxLength?: number;
  pattern?: RegExp;
  register: () => {};
  required?: boolean;
  errors: Record<string, string>;
  type: string;
  placeholder: string;
  title: string;
}

const TextArea = function TextArea({
  id,
  rows,
  maxLength,
  pattern,
  placeholder,
  register,
  required,
  errors,
  title,
}: TextAreaProps): JSX.Element {
  return (
    <div className={container}>
      <label htmlFor={id} className={screenReaderText}>
        {title}
      </label>
      <textarea
        id={id}
        aria-describedby={errors ? `${id}-error` : null}
        aria-invalid={!!errors}
        aria-required={required}
        className={input}
        placeholder={placeholder}
        rows={rows}
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

TextArea.defaultProps = {
  rows: 5,
  maxLength: 1024,
  pattern: null,
  required: false,
};

export default TextArea;
