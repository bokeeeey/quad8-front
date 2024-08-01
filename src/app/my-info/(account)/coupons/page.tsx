import classNames from 'classnames/bind';
import styles from './page.module.scss';
import Coupon from './_components/Coupon';

const cn = classNames.bind(styles);

export default function page() {
  return (
    <div className={cn('container')}>
      {/* {content.length > 0 ? ( */}
      <div>
        <header className={cn('title')}>보유 중인 쿠폰</header>
        <Coupon />
      </div>
      {/* ) : (
      <MyInfoEmptyCase message='내 게시글이 없습니다.' />
    )} */}
    </div>
  );
}
