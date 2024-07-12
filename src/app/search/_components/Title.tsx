import classNames from 'classnames/bind';
import styles from './Title.module.scss';

const cn = classNames.bind(styles);

interface TitleProps {
  keyword: string;
  count: number;
}

export default function Title({ keyword, count }: TitleProps) {
  return (
    <div className={cn('title')}>
      &apos;<div className={cn('keyword')}>{keyword}</div>&apos;&nbsp;
      <div className={cn('text')}>{`검색 결과(${count <= 99 ? count : '99+'})`}</div>
    </div>
  );
}
