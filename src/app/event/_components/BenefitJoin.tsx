import classNames from 'classnames/bind';
import styles from './BenefitJoin.module.scss';
import EventTitle from './EventTitle';

const cn = classNames.bind(styles);
export default function BenefitJoin() {
  return (
    <div id='join' className={cn('container')}>
      <EventTitle title='WELCOME 쿠폰'>
        즉시 사용가능한 <br /> 신규 가입 쿠폰 증정
      </EventTitle>
      <div className={cn('inner')}>쿠폰존</div>
    </div>
  );
}
