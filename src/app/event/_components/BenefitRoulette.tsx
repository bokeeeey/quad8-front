import classNames from 'classnames/bind';
import styles from './BenefitRoulette.module.scss';
import EventTitle from './EventTitle';
import Roulette from './Roulette';

const cn = classNames.bind(styles);

export default function BenefitRoulette() {
  return (
    <section id='roulette' className={cn('container')}>
      <EventTitle title='랜덤쿠폰 증정' color='white'>
        매일 9시 한번 100% 당첨 <br /> 쿠폰 룰렛 돌리기!
      </EventTitle>
      <div className={cn('roulette-zone')}>
        <Roulette />
        <span className={cn('center')}> 📌 룰렛 쿠폰은 발급 시간 기준 24시간 동안 사용가능합니다.</span>
      </div>
    </section>
  );
}
