'use client';

import { getProductLikes } from '@/api/likesAPI';
import { Button } from '@/components';
import { QUERY_KEYS } from '@/constants/queryKey';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import WishItem from './WishItem';
import styles from './WishList.module.scss';

const cn = classNames.bind(styles);

export default function WishList() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.LIKE.LISTS(),
    queryFn: () => getProductLikes,
  });

  if (isLoading) {
    return null;
  }
  // const [isAllChecked, setIsAllChecked] = useState(false);
  // const [selectedList, setSelectedList] = useState([]);

  // console.log(isAllChecked);
  return (
    <div className={cn('container')}>
      <div className={cn('check-container')}>
        <div className={cn('check-area')}>
          <input type='checkbox' />
          <span>전체 선택</span>
        </div>
        <div className={cn('button-area')}>
          <Button backgroundColor='outline-primary' fontSize={14}>
            선택 삭제
          </Button>
          <Button backgroundColor='outline-primary' fontSize={14}>
            전체 삭제
          </Button>
        </div>
      </div>
      <ul className={cn('item-list')}>{data?.map((item) => <WishItem key={item.productId} {...item} />)}</ul>
    </div>
  );
}
