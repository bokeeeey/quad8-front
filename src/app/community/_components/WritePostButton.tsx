'use client';

import { PlusIcon } from '@/public/index';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Button, Modal } from '@/components';
import Dialog from '@/components/Dialog/Dialog';
import { ROUTER } from '@/constants/route';
import WriteEditModal from '@/components/WriteEditModal/WriteEditModal';
import type { PostCardDetailModalCustomKeyboardType } from '@/types/CommunityTypes';
import type { Users } from '@/types/userType';
import { getCustomOrderList } from '@/api/communityAPI';
import SignInModal from '@/components/SignInModal/SignInModal';
import OrderListModal from './OrderListModal';

import styles from './WritePostButton.module.scss';

const cn = classNames.bind(styles);

interface UserDataType {
  data: Users;
  status: string;
  message: string;
}

export default function WritePostButton() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isOpenOrderListModal, setIsOpenOrderListModal] = useState(false);
  const [isOpenSignInModal, setIsOpenSignInModal] = useState(false);
  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PostCardDetailModalCustomKeyboardType | null>(null);

  const userData = queryClient.getQueryData<UserDataType>(['userData']);

  const { data: orderListData } = useQuery({
    queryKey: ['orderList'],
    queryFn: getCustomOrderList,
  });

  const handleClickButton = () => {
    if (!userData?.data) {
      setIsOpenSignInModal(true);
    } else {
      setIsOpenOrderListModal(true);
    }
  };

  const handleClickProductList = (i: number) => {
    setSelectedOrder(orderListData.data[i]);
  };

  const closeOrderListModal = () => {
    setIsOpenOrderListModal(false);
  };

  const openReviewModal = () => {
    setIsOpenOrderListModal(false);
    setIsOpenReviewModal(true);
  };

  const closeReviewModal = () => {
    setIsOpenReviewModal(false);
    setIsOpenOrderListModal(true);
  };

  const handleSuccessPost = () => {
    setIsOpenReviewModal(false);
    setIsOpenOrderListModal(false);
    queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
  };

  return (
    <div>
      <Button width={120} fontSize={14} paddingVertical={8} radius={4} onClick={handleClickButton}>
        <div className={cn('write-button-content')}>
          <PlusIcon /> 글 작성하기
        </div>
      </Button>
      {orderListData &&
        (orderListData?.data?.length > 0 ? (
          <>
            <Modal isOpen={isOpenOrderListModal} onClose={closeOrderListModal}>
              <OrderListModal
                orderList={orderListData.data}
                onOpenReviewModal={openReviewModal}
                onSelectProduct={handleClickProductList}
                selectedOrder={selectedOrder}
              />
            </Modal>
            {selectedOrder && (
              <Modal isOpen={isOpenReviewModal} onClose={closeReviewModal}>
                <WriteEditModal
                  keyboardInfo={selectedOrder}
                  reviewType='customReview'
                  onSuccessReview={handleSuccessPost}
                />
              </Modal>
            )}
          </>
        ) : (
          <Dialog
            type='confirm'
            message='커스텀 키보드 구매내역이 없습니다.'
            isOpen={isOpenOrderListModal}
            iconType='warn'
            buttonText={{ left: '댣기', right: '커스텀 만들러 가기' }}
            onClick={{
              left: () => setIsOpenOrderListModal(false),
              right: () => {
                router.push(ROUTER.CUSTOM_KEYBOARD);
              },
            }}
          />
        ))}
      <SignInModal isOpen={isOpenSignInModal} onClose={() => setIsOpenSignInModal(false)} />
    </div>
  );
}
