'use client';

import { getProductLikes } from '@/api/likesAPI';
import { MyInfoEmptyCase } from '@/app/my-info/_components';
import { Button } from '@/components';
import { QUERY_KEYS } from '@/constants/queryKey';
import { GetProductLikesParams, WishlistPageProps } from '@/types/LikeTypes';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { ChangeEvent, useState } from 'react';
import WishItem from './WishItem';
import styles from './WishList.module.scss';

const cn = classNames.bind(styles);

export default function WishList({ searchParams }: WishlistPageProps) {
  const [selectedList, setSelectedList] = useState<Set<number>>(new Set());

  console.log(selectedList);

  const getProductLikesParams: GetProductLikesParams = {
    page: searchParams.page || '0',
    size: searchParams.size || '10',
  };

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.LIKE.LISTS(), searchParams],
    queryFn: () => getProductLikes(getProductLikesParams),
  });
  console.log(data?.length);

  if (isLoading) {
    return null;
  }

  if (data?.length === 0) {
    return <MyInfoEmptyCase message='찜한 상품이 없습니다.' />;
  }

  const updateSet = (set: Set<number>, id: number) => {
    const updatedSet = new Set(set);

    if (updatedSet.has(id)) {
      updatedSet.delete(id);
    } else {
      updatedSet.add(id);
    }

    return updatedSet;
  };

  const handleOnChange = (id: number) => {
    setSelectedList((prevSet) => updateSet(prevSet, id));
  };
  const toggleAllCheckedById = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (checked) {
      const allChecked = new Set(data?.map(({ productId }) => productId));
      setSelectedList(allChecked);
    } else {
      setSelectedList(new Set());
    }
  };

  return (
    <div className={cn('container')}>
      <div className={cn('check-container')}>
        <div className={cn('check-area')}>
          <input
            type='checkbox'
            id='all-check'
            onChange={toggleAllCheckedById}
            checked={data?.length === selectedList.size}
            className={cn('select-item-input')}
          />
          <label htmlFor='all-check' className={cn('select-item-label')} />
        </div>
        <div className={cn('button-area')}>
          <Button backgroundColor='outline-primary' fontSize={14} width={90} paddingVertical={8} radius={4}>
            선택 삭제
          </Button>
          <Button backgroundColor='outline-primary' fontSize={14} width={90} paddingVertical={8} radius={4}>
            전체 삭제
          </Button>
        </div>
      </div>
      <ul className={cn('item-list')}>
        {data?.map((item) => (
          <WishItem
            checked={selectedList.has(item.productId)}
            onChange={handleOnChange}
            key={item.productId}
            {...item}
          />
        ))}
      </ul>
    </div>
  );
}
