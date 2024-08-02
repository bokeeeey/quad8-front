import classNames from 'classnames/bind';
import styles from './CouponList.module.scss';
import Coupon from './Coupon';

const cn = classNames.bind(styles);

export default function CouponList() {
  return (
    <div className={cn('container')}>
      <Coupon />
      <Coupon />
      <Coupon />
      <Coupon />
      <Coupon />
      <Coupon />
      <Coupon />
    </div>
  );
}
