'use client';

import { ChangeEvent, FocusEvent, forwardRef, useState, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames/bind';

import { CrossIcon, DashIcon } from '@/public/index';

import styles from './CountInput.module.scss';

const cn = classNames.bind(styles);

interface CountInputProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: (e?: FocusEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

const NUMBER_REGEX = /^-?\d+$/;

export default forwardRef<HTMLInputElement, CountInputProps>(function CountInput(
  { value, onChange, onBlur, min = 1, max = 99, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [count, setCount] = useState<number | '' | '-'>(
    typeof value === 'number' ? Math.max(Math.min(value, max), min) : min,
  );
  const [prevValue, setPrevValue] = useState<number>(
    typeof value === 'number' ? Math.max(Math.min(value, max), min) : min,
  );

  const handleChangeCount = (type: 'decrease' | 'increase') => {
    if (!inputRef.current || !NUMBER_REGEX.test(inputRef.current.value)) {
      return;
    }

    const newValue = type === 'decrease' ? Number(inputRef.current.value) - 1 : Number(inputRef.current.value) + 1;
    const rangeValue = Math.max(Math.min(newValue, max), min);

    setCount(rangeValue);
    setPrevValue(rangeValue);

    if (rangeValue >= max || rangeValue <= min) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    if (onChange) {
      onChange(rangeValue);
    }
  };

  const handleButtonMouseDown = (type: 'decrease' | 'increase') => {
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      intervalRef.current = setInterval(() => {
        handleChangeCount(type);
      }, 80);
    }, 500);
  };

  const handleButtonMouseUp = (type: 'decrease' | 'increase') => {
    handleChangeCount(type);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    if (!NUMBER_REGEX.test(inputValue)) {
      if (inputValue === '' || inputValue === '-') {
        setCount(inputValue);
      }
      return;
    }
    const newValue = Math.min(Math.max(Number(inputValue), min), max);

    setCount(newValue);
    setPrevValue(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!NUMBER_REGEX.test(e.currentTarget.value)) {
      setCount(prevValue);
      if (onChange) {
        onChange(prevValue);
      }
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  return (
    <div className={cn('wrapper')}>
      <button
        type='button'
        className={cn('button', 'left', { disabled: Number(count) <= min })}
        onMouseDown={() => handleButtonMouseDown('decrease')}
        onMouseUp={() => handleButtonMouseUp('decrease')}
        disabled={Number(count) <= min}
      >
        <DashIcon width={12} height={14} className={cn('icon', { disabled: Number(count) <= min })} />
      </button>
      <input
        className={cn('input')}
        ref={inputRef}
        value={count}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        {...rest}
      />
      <button
        type='button'
        className={cn('button', 'right', { disabled: Number(count) >= max })}
        onMouseDown={() => handleButtonMouseDown('increase')}
        onMouseUp={() => handleButtonMouseUp('increase')}
        disabled={Number(count) >= max}
      >
        <CrossIcon width={12.5} height={12.5} className={cn('icon', { disabled: Number(count) >= max })} />
      </button>
    </div>
  );
});
