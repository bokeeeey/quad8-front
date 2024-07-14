import classNames from 'classnames/bind';

import ProductItem from '@/components/Products/ProductItem';
import { ContentType } from '@/types/SearchType';

import styles from './CardList.module.scss';

const cn = classNames.bind(styles);

interface CardListProps {
  cardData: ContentType[];
}

export default function CardList({ cardData }: CardListProps) {
  return (
    <div className={cn('wrapper')}>
      {cardData.map((card) => (
        <ProductItem
          key={card.productId}
          size='lg'
          hasShop={false}
          id={card.productId}
          reviewscount={card.reviewCount}
          isLiked={card.liked}
          {...card}
        />
      ))}
    </div>
  );
}
