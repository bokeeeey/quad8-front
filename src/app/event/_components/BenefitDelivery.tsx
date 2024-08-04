import { deliveryImg } from '@/public/index';
import classNames from 'classnames/bind';
import Image from 'next/image';
import styles from './BenefitDelivery.module.scss';
import EventTitle from './EventTitle';

const cn = classNames.bind(styles);
export default function BenefitDelivery() {
  return (
    <div id='delivery' className={cn('container')}>
      <EventTitle title='배송비 FREE' color='black'>
        키득은 하나를 사도 <br /> 배송비 무료
      </EventTitle>
      <div className={cn('inner')}>
        <div className={cn('delivery-img-wrap')}>
          <Image src={deliveryImg} width={557} height={526} alt='무료배송이미지' className={cn('delivery-img')} />
        </div>
        <span>키캡은 세트 구매시에만 적용됩니다</span>
      </div>
    </div>
  );
}
