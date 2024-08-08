'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { deleteProductLikes, getProductLikes } from '@/api/likesAPI';
import { MyInfoEmptyCase } from '@/app/my-info/_components';
import { Button, Dialog } from '@/components';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import Pagination from '@/components/Pagination/Pagination';
import { QUERY_KEYS } from '@/constants/queryKey';
import type { GetProductLikesParams, WishlistPageProps } from '@/types/likeType';
import WishItem from './WishItem';

import styles from './WishList.module.scss';

const cn = classNames.bind(styles);

export default function WishList({ searchParams }: WishlistPageProps) {
  const queryClient = useQueryClient();
  const [selectedList, setSelectedList] = useState<Set<number>>(new Set());
  const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  const getProductLikesParams: GetProductLikesParams = {
    page: searchParams.page || '0',
    size: searchParams.size || '10',
  };

  const { data: likeList, isPending } = useQuery({
    queryKey: [...QUERY_KEYS.LIKE.LISTS(), searchParams],
    queryFn: () => getProductLikes(getProductLikesParams),
  });

  const { mutate: deleteWishItem } = useMutation({
    mutationFn: deleteProductLikes,
    onSuccess: () => {
      toast.success('삭제를 완료 했습니다.');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LIKE.LISTS(),
      });

      setIsDeleteSelectedOpen(false);
      setIsDeleteAllOpen(false);
      setSelectedList(new Set());
    },
  });

  if (isPending) {
    return <LogoLoading />;
  }

  const productList = likeList?.likedProductsResponses;

  if (productList?.length === 0) {
    return <MyInfoEmptyCase message='찜한 상품이 없습니다.' />;
  }

  if (!likeList) {
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

  const handleChangeSelectedList = (id: number) => {
    setSelectedList((prevSet) => updateSet(prevSet, id));
  };
  const toggleAllCheckedById = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (checked) {
      const allChecked = new Set(productList?.map(({ productId }) => productId));
      setSelectedList(allChecked);
    } else {
      setSelectedList(new Set());
    }
  };

  const isAllSelected = () => productList?.every((v) => selectedList.has(v.productId));

  const handleAllDelete = () => {
    if (!productList) {
      return;
    }
    deleteWishItem(productList.map(({ productId }) => productId));
  };

  const handleSelectedDelete = () => {
    if (!productList) {
      return;
    }
    deleteWishItem([...selectedList]);
  };

  return (
    <div className={cn('container')}>
      <div className={cn('check-container')}>
        <div className={cn('check-area')}>
          <input
            type='checkbox'
            id='all-check'
            onChange={toggleAllCheckedById}
            checked={isAllSelected()}
            className={cn('select-item-input')}
          />
          <label htmlFor='all-check' className={cn('select-item-label')} />
        </div>
        <div className={cn('button-area')}>
          <Button
            backgroundColor='outline-primary'
            fontSize={14}
            width={90}
            paddingVertical={8}
            radius={4}
            onClick={() => setIsDeleteAllOpen(true)}
          >
            선택 삭제
          </Button>
          <Button
            backgroundColor='outline-primary'
            fontSize={14}
            width={90}
            paddingVertical={8}
            radius={4}
            onClick={() => setIsDeleteSelectedOpen(true)}
          >
            전체 삭제
          </Button>
        </div>
      </div>
      <ul className={cn('item-list')}>
        {productList?.map((item) => (
          <WishItem
            checked={selectedList.has(item.productId)}
            onChange={handleChangeSelectedList}
            key={item.productId}
            {...item}
          />
        ))}
      </ul>
      <Dialog
        type='confirm'
        iconType='warn'
        message='전체 삭제 하시겠습니까?'
        isOpen={isDeleteSelectedOpen}
        onClick={{ left: () => setIsDeleteSelectedOpen(false), right: handleAllDelete }}
        buttonText={{ left: '취소', right: '확인' }}
      />
      <Dialog
        type='confirm'
        iconType='warn'
        message='선택 삭제 하시겠습니까?'
        isOpen={isDeleteAllOpen}
        onClick={{ left: () => setIsDeleteAllOpen(false), right: handleSelectedDelete }}
        buttonText={{ left: '취소', right: '확인' }}
      />
      <Pagination
        number={likeList.currentPage}
        totalElements={likeList.totalElements}
        totalPages={likeList.totalPages}
        first={likeList.first}
        last={likeList.last}
        searchParams={searchParams}
      />
    </div>
  );
}
