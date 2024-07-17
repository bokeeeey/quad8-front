import { CloverIcon } from '@/public/index';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from './EventTitle.module.scss';

const cn = classNames.bind(styles);

interface EventTitleProps {
  title: string;
  children: ReactNode;
}

export default function EventTitle({ title, children }: EventTitleProps) {
  return (
    <div className={cn('title-wrap')}>
      <div className={cn('title-top')}>
        <CloverIcon />
        <h2>{title}</h2>
        <CloverIcon />
      </div>

      <h1 className={cn('main-title')}>{children}</h1>
    </div>
  );
}
