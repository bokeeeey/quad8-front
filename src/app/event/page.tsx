import classNames from 'classnames/bind';

import { BenefitDelivery, BenefitJoin, BenefitRoulette, EventBottom, EventTab, EventTop } from './_components';
import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default function Page() {
  return (
    <div className={cn('container')}>
      <EventTop />
      <EventTab />
      <BenefitJoin />
      <BenefitRoulette />
      <BenefitDelivery />
      <EventBottom />
    </div>
  );
}
