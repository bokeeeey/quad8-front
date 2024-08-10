'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getProductDetail } from '@/api/productAPI';
import type { ProductType } from '@/types/productType';
import type { OrderItem } from '@/types/orderType';
import { convertCategory } from '@/libs/convertProductCategory';
import { IMAGE_BLUR } from '@/constants/blurImage';
import CustomOption from '../CustomOption/CustomOption';
import ItemWrapper from './ItemWrapper';
import ShopOption from './ShopOption';

import styles from './ItemOverview.module.scss';

const cn = classNames.bind(styles);

interface ItemOverviewProps {
  item: OrderItem;
  imegeWidth?: number;
  imageHeight?: number;
  className?: string;
  routeDetailPage?: boolean;
}

const CATEGORY_NAME = {
  keyboard: '키보드',
  keycap: '키캡',
  switch: '스위치',
  etc: '기타 용품',
};

export default function ItemOverview({
  item,
  imegeWidth = 107,
  imageHeight = 107,
  className,
  routeDetailPage,
}: ItemOverviewProps) {
  const { productImgUrl, productName, switchOption, quantity } = item;

  const { data: productData } = useQuery<ProductType>({
    queryKey: ['product', item.productId],
    queryFn: () => getProductDetail(item.productId),
    enabled: productName !== '커스텀 키보드',
  });

  const category = convertCategory(productData?.categoryName);

  return (
    <ItemWrapper
      className={className}
      productName={productName}
      category={category}
      routeDetailPage={routeDetailPage}
      productId={item.productId}
    >
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
          <p className={cn('title')}>키드 커스텀 키보드</p>
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
          <p className={cn('title')}>{category ? CATEGORY_NAME[category] : ''}</p>
          <p>{productName}</p>
          {typeof item.switchOption === 'string' && <ShopOption optionName={item.switchOption} count={quantity} />}
        </div>
      )}
    </ItemWrapper>
  );
}
