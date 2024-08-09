import { Button } from '@/components';
import type { OrderStatus } from '@/types/orderType';
import classNames from 'classnames/bind';
import styles from './OrderItemButton.module.scss';

const cn = classNames.bind(styles);

interface OrderItemButtonProps {
  orderStatus: OrderStatus;
  onEditReviewClick: () => void;
}

export default function OrderItemButton({ orderStatus, onEditReviewClick }: OrderItemButtonProps) {
  const renderButton = () => {
    switch (orderStatus) {
      case 'PAYMENT_COMPLETED' || 'PREPARING' || 'CONFIRMED':
        return (
          <Button className={cn('button')} type='button' radioGroup='4' paddingVertical={8} onClick={onEditReviewClick}>
            후기 작성
          </Button>
        );

      case 'READY':
        return (
          <Button className={cn('button')} type='button' radioGroup='4' paddingVertical={8}>
            구매 하기
          </Button>
        );

      case 'SHIPPING' || 'DELIVERED':
        return (
          <>
            <Button className={cn('button')} type='button' radioGroup='4' paddingVertical={8}>
              배송 조회
            </Button>
            <Button
              className={cn('button')}
              type='button'
              radioGroup='4'
              paddingVertical={8}
              onClick={onEditReviewClick}
            >
              후기 작성
            </Button>
          </>
        );

      case 'CANCELED':
        return (
          <Button className={cn('button')} type='button' radioGroup='4' paddingVertical={8}>
            더 둘러보기
          </Button>
        );

      default:
        return null;
    }
  };

  return renderButton();
}
