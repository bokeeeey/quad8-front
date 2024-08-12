import { ROUTER } from '@/constants/route';
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './EventBottom.module.scss';
import EventTitle from './EventTitle';

const cn = classNames.bind(styles);
export default function EventBottom() {
  return (
    <div className={cn('container')}>
      <EventTitle title='키득은 사실 유무명한 키덕필수템임' color='white'>
        아직도 키득회원이 아니라면?
      </EventTitle>
      <div className={cn('button-area')}>
        <Link href={ROUTER.AUTH.SIGN_UP} className={cn('button')}>
          회원 가입 하러 가기
        </Link>
      </div>
    </div>
  );
}
