import { IMAGE_BLUR } from '@/constants/blurImage';
import type { OrderItem } from '@/types/orderType';
import classNames from 'classnames/bind';
import Image from 'next/image';
import CustomOption from '../CustomOption/CustomOption';

import styles from './ItemOverview.module.scss';

const cn = classNames.bind(styles);

interface ItemOverviewProps {
  item: OrderItem;
  imegeWidth?: number;
  imageHeight?: number;
  className?: string;
  onClick?: () => void;
}

export default function ItemOverview({
  item,
  imegeWidth = 107,
  imageHeight = 107,
  className,
  onClick,
}: ItemOverviewProps) {
  const { productImgUrl, productName, switchOption, quantity } = item;

  const handleItemClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={cn('item', className)} onClick={handleItemClick}>
      <Image
        src={productImgUrl}
        alt={productName}
        width={imegeWidth}
        height={imageHeight}
        placeholder={IMAGE_BLUR.placeholder}
        blurDataURL={IMAGE_BLUR.blurDataURL}
        className={cn('product-image')}
      />
      {productName === '커스텀 키보드' && typeof switchOption !== 'string' ? (
        <div className={cn('item-option')}>
          <p className={cn('keydeuk-keyboard-title')}>키드 커스텀 키보드</p>
          <CustomOption
            customData={{
              texture: switchOption.customOption.appearanceTexture,
              type: switchOption.customOption.layout,
              boardColor: switchOption.customOption.appearanceColor,
              switchType: switchOption.customOption.keyboardSwitch,
              baseKeyColor: switchOption.customOption.baseKeyColor,
              hasPointKeyCap: switchOption.customOption.hasPointKey,
              pointKeyType: switchOption.customOption.pointKeyType,
              pointSetColor: switchOption.customOption.pointSetColor,
              individualColor: switchOption.individualColor,
            }}
          />
        </div>
      ) : (
        <div className={cn('item-text')}>
          <p>{productName}</p>
          <p className={cn('item-quantity')}>{quantity}개</p>
        </div>
      )}
    </div>
  );
}
