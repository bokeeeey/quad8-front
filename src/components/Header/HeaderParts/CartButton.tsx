import classNames from 'classnames/bind';
import { CartIcon } from '@/public/index';
import styles from './CartButton.module.scss';

interface CartButtonProps {
  cartCount: number;
  isBlack?: boolean;
  onClick: () => void;
}

const cn = classNames.bind(styles);

const MAX_CART_COUNT = 9;

export default function CartButton({ cartCount, isBlack, onClick }: CartButtonProps) {
  const countStatus = cartCount > MAX_CART_COUNT ? `${MAX_CART_COUNT}+` : String(cartCount);

  return (
    <div className={cn('wrapper')} onClick={onClick}>
      <CartIcon className={cn('cart-icon', { black: isBlack })} />
      {cartCount > 0 && (
        <div className={cn('cart-count', cartCount > MAX_CART_COUNT && 'count-more-digit')}>{countStatus}</div>
      )}
    </div>
  );
}
