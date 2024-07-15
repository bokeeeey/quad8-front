import classNames from 'classnames/bind';
import { NoReviewIcon } from '@/public/index';
import styles from './CommunityEmptyCase.module.scss';

const cn = classNames.bind(styles);

export default function CommunityEmptyCase() {
  return (
    <div className={cn('container')}>
      <NoReviewIcon />
      게시글이 없어요!
    </div>
  );
}
