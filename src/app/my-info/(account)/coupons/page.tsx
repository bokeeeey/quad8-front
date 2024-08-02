import classNames from 'classnames/bind';
import styles from './page.module.scss';
import CouponList from './_components/CouponList';

const cn = classNames.bind(styles);

export default function page() {
  return (
    <div className={cn('container')}>
      {/* {content.length > 0 ? ( */}
      <header className={cn('title')}>보유 중인 쿠폰</header>
      <CouponList />
      {/* ) : (
      <MyInfoEmptyCase message='내 게시글이 없습니다.' />
    )} */}
    </div>
  );
}
