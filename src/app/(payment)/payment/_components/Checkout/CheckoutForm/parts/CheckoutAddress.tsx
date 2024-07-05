import { Button, Dropdown } from '@/components';
import type { ShippingAddressResponse } from '@/types/paymentTypes';
import classNames from 'classnames/bind';
import styles from './CheckoutAddress.module.scss';

const cn = classNames.bind(styles);

const DELIVERY_OPTIONS = ['부재시 문앞에 놓아주세요.', '경비실에 맡겨 주세요', '직접 입력'];

interface CheckoutAddressProps {
  item: ShippingAddressResponse;
}

export default function CheckoutAddress({ item }: CheckoutAddressProps) {
  const { address, detailAddress, name, phone } = item;
  return (
    <div className={cn('address-section')}>
      <h1>배송 주소</h1>
      <div className={cn('address-box')}>
        <div className={cn('address-wrap')}>
          <div className={cn('address-key')}>
            <p>받는분</p>
            <p>연락처</p>
            <p>배송 주소</p>
          </div>
          <div className={cn('address-value')}>
            <p>{name}</p>
            <p>{phone}</p>
            <p>
              {address} {detailAddress}
            </p>
          </div>
        </div>
        <Button type='button' paddingVertical={8} width={72} radius={4}>
          변경
        </Button>
      </div>
      <Dropdown
        options={DELIVERY_OPTIONS}
        name='드롭다운2'
        sizeVariant='sm'
        placeholder='배송 요청 사항을 선택해 주세요.'
      />
    </div>
  );
}
