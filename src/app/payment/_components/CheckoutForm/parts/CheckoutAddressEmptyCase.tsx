import { Button } from '@/components';
import classNames from 'classnames/bind';
import styles from './CheckoutAddressEmptyCase.module.scss';

const cn = classNames.bind(styles);

interface CheckoutAddressEmptyCaseProps {
  onClick: () => void;
}

export default function CheckoutAddressEmptyCase({ onClick }: CheckoutAddressEmptyCaseProps) {
  return (
    <div className={cn('container')}>
      <h1>배송지를 먼저 등록해주세요</h1>
      <Button className={cn('button')} type='button' paddingVertical={8} onClick={onClick}>
        + 등록하기
      </Button>
    </div>
  );
}
