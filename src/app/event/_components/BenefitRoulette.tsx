import classNames from 'classnames/bind';
import styles from './BenefitRoulette.module.scss';
import EventTitle from './EventTitle';
import Wheel from './Wheel';

const cn = classNames.bind(styles);

export default function BenefitRoulette() {
  return (
    <div id='roulette' className={cn('container')}>
      <EventTitle title='랜덤쿠폰 증정' color='white'>
        즉시 매일 한번 100% 당첨 <br /> 쿠폰 룰렛 돌리기!
      </EventTitle>
      <div className={cn('roulette-zone')}>
        <Wheel />
      </div>
    </div>
  );
}
