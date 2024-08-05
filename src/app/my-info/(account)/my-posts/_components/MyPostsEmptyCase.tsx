import classNames from 'classnames/bind';
import { NoReviewIcon } from '@/public/index';

import { Button } from '@/components';
import Link from 'next/link';

import styles from './MyPostsEmptyCase.module.scss';

const cn = classNames.bind(styles);

export default function MyPostsEmptyCase() {
  return (
    <div className={cn('container')}>
      <NoReviewIcon />내 게시글이 없어요!
      <Button
        as={Link}
        href='/community'
        width={320}
        hoverColor='background-primary'
        backgroundColor='background-gray-40'
      >
        다른 게시글 구경하러가기
      </Button>
    </div>
  );
}
