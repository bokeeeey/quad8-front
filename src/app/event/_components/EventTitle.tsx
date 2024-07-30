import { CloverIcon } from '@/public/index';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from './EventTitle.module.scss';

const cn = classNames.bind(styles);

interface EventTitleProps {
  title: string;
  children: ReactNode;
  color: 'white' | 'black';
}

export default function EventTitle({ title, children, color }: EventTitleProps) {
  return (
    <div className={cn('title-wrap', { white: color === 'white', black: color === 'black' })}>
      <div className={cn('title-top')}>
        <CloverIcon fill={color === 'white' ? '#fff' : '#000'} />
        <h2>{title}</h2>
        <CloverIcon fill={color === 'white' ? '#fff' : '#000'} />
      </div>

      <h1 className={cn('main-title')}>{children}</h1>
    </div>
  );
}
