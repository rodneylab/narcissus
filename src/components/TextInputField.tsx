import React from 'react';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import { screenReaderText } from '../styles/styles.css';
import { container, input } from './TextInputField.css';

const FormInput: FC<{
  id: string;
  maxLength: number;
  pattern: RegExp;
  register: () => {};
  required: boolean;
  errors: Record<string, string>;
  type: string;
  placeholder: string;
  title: string;
}> = ({
  ariaLabel,
  id,
  maxLength = 64,
  pattern,
  placeholder,
  register,
  required,
  errors,
  type,
  title,
}) => (
  <div className={container}>
    <label htmlFor={id} className={screenReaderText}>
      {title}
    </label>
    <input
      id={id}
      aria-describedby={errors ? `${id}-error` : null}
      aria-label={ariaLabel}
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

FormInput.defaultProps = {
  ariaInvalid: false,
  maxLength: 1024,
  pattern: null,
  required: false,
};

FormInput.propTypes = {
  ariaInvalid: PropTypes.bool,
  ariaLabel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  label: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pattern: PropTypes.object,
  register: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export { FormInput as default };
