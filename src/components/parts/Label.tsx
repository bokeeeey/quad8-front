import classNames from 'classnames/bind';
import { LabelHTMLAttributes, ReactNode } from 'react';
import styles from './Label.module.scss';

const cn = classNames.bind(styles);

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  sizeVariant?: 'sm' | 'md' | 'lg' | 'header';
  children: ReactNode;
}

export default function Label({ sizeVariant, htmlFor, children }: LabelProps) {
  const className = cn('default', sizeVariant);

  return (
    <label className={className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
