import classNames from 'classnames/bind';
import BenefitDelivery from './_components/BenefitDelivery';
import BenefitJoin from './_components/BenefitJoin';
import BenefitRoulette from './_components/BenefitRoulette';
import EventTab from './_components/EventTab';
import EventTop from './_components/EventTop';
import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default function Page() {
  return (
    <div className={cn('container')}>
      <EventTop />
      <EventTab />
      <BenefitJoin />
      <BenefitRoulette />
      {/* <Test /> */}
      <BenefitDelivery />
    </div>
  );
}
