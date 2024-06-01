import classNames from 'classnames/bind';
import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from 'react';
import { ErrorMessage, Radio } from '../parts';
import styles from './RadioField.module.scss';

const cn = classNames.bind(styles);

interface RadioFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: string[];
  errorMessage?: string;
}

export default forwardRef<HTMLInputElement, RadioFieldProps>(function RadioField(
  { label, options, errorMessage, ...rest },
  ref,
) {
  const [isSelected, setIsSelected] = useState(options[0]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSelected(e.target.value);
    if (rest.onChange) {
      rest.onChange(e);
    }
  };

  return (
    <fieldset className={cn('radio-field')}>
      <legend className={cn('label')}>{label}</legend>
      <div className={cn('radio-box')}>
        {options.map((option) => (
          <Radio
            name={label}
            ref={ref}
            key={option}
            id={option}
            value={option}
            onChange={handleChange}
            checked={isSelected === option}
            isError={!!errorMessage}
            {...rest}
          />
        ))}
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </fieldset>
  );
});
