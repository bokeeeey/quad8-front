import { Button } from '@/components';
import classNames from 'classnames/bind';
import styles from './AddressesEmptyCase.module.scss';

const cn = classNames.bind(styles);

interface AddressesEmptyCaseProps {
  isDisplayOnModal?: boolean;
  onClick?: () => void;
}

export default function AddressesEmptyCase({ isDisplayOnModal, onClick }: AddressesEmptyCaseProps) {
  return (
    <article className={cn('addresses')}>
      <div className={cn('text-box')}>
        <p>등록된 배송지 정보가 없습니다.</p>
        <p>새 배송지 정보를 등록해주세요.</p>
      </div>

      {isDisplayOnModal && (
        <Button className={cn('button')} type='button' paddingVertical={8} onClick={onClick}>
          + 새 주소 추가
        </Button>
      )}
    </article>
  );
}
