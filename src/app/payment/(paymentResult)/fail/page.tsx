import classNames from 'classnames/bind';
import CheckoutNavigation from '../../_components/CheckoutNavigation/CheckoutNavigation';
import CheckoutFail from './_components/CheckoutFail';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default function PaymentFailPage() {
  return (
    <section className={cn('page')}>
      <CheckoutNavigation isFailed />
      <CheckoutFail />
    </section>
  );
}
