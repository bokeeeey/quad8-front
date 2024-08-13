import { CloverIcon } from '@/public/index';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from './EventTitle.module.scss';

const cn = classNames.bind(styles);

interface EventTitleProps {
  title?: string;
  children: ReactNode;
  color: 'white' | 'black';
}

export default function EventTitle({ title, children, color }: EventTitleProps) {
  const fillColor = color === 'white' ? '#fff' : '#000';
  return (
    <div className={cn('title-wrap', color)}>
      <div className={cn('title-top')}>
        <CloverIcon fill={fillColor} />
        {title && <h2>{title}</h2>}
        <CloverIcon fill={fillColor} />
      </div>
      <h1 className={cn('main-title')}>{children}</h1>
    </div>
  );
}
