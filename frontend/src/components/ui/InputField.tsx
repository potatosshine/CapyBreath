import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseProps = {
  label: string;
  error?: string;
  helperText?: string;
};

type InputFieldProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaFieldProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type Props = InputFieldProps | TextareaFieldProps;

const SupportText = ({ error, helperText }: { error?: string; helperText?: string }) => {
  if (error) {
    return <span className="ui-field__error">{error}</span>;
  }

  if (helperText) {
    return <span className="text-sm">{helperText}</span>;
  }

  return null;
};

const InputField = (props: Props) => {
  const fieldClass = `ui-field ${props.error ? 'ui-field--error' : ''}`.trim();

  if (props.multiline) {
    const { label, error, helperText, multiline: _multiline, className, ...textareaProps } = props;
    void _multiline;

    return (
      <label className={fieldClass}>
        <span className="ui-field__label">{label}</span>
        <textarea
          className={`ui-field__control ui-field__control--multiline ${className ?? ''}`.trim()}
          {...textareaProps}
        />
        <SupportText error={error} helperText={helperText} />
      </label>
    );
  }

  const { label, error, helperText, multiline: _multiline, className, ...inputProps } = props;
  void _multiline;

  return (
    <label className={fieldClass}>
      <span className="ui-field__label">{label}</span>
      <input className={`ui-field__control ${className ?? ''}`.trim()} {...inputProps} />
      <SupportText error={error} helperText={helperText} />
    </label>
  );
};

export default InputField;
