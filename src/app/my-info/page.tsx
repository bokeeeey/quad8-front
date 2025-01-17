import classNames from 'classnames/bind';
import { DeliveryStatus, RecentProducts, UserProfile } from './_components';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default async function MyInfoPage() {
  return (
    <section className={cn('my-page')}>
      <UserProfile />
      <DeliveryStatus />
      <RecentProducts />
    </section>
  );
}
