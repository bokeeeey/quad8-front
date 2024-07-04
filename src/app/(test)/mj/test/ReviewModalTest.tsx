'use client';

import { Button, Modal } from '@/components';
import WriteEditModal from '@/components/WriteEditModal/WriteEditModal';
import classNames from 'classnames/bind';
import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getOrdersData } from '@/api/orderAPI';
import styles from './ReviewModalTest.module.scss';

const cn = classNames.bind(styles);

export default function ReviewModalTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const { data } = useQuery({
  //   queryKey: ['orderList'],
  //   queryFn: getOrdersData,
  // });
  // console.log(data);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleButtonClick = () => {
    /** 버튼 누를 때 실행되는 함수 */
    // console.log('버튼 누름');
  };

  const handleSuccessReview = () => {
    // console.log('리뷰 작성');
  };

  const PRODUCT_DATA = {
    productId: 19384,
    orderId: 12345,
    option: '옵션입니다',
    productImgUrl: '',
    productName: '상품 이름',
  };

  return (
    <div className={cn('container')}>
      <div className={cn('buttons')}>
        <button type='button' onClick={handleOpenModal}>
          커스텀 리뷰 모달창 열기
        </button>
      </div>
      <Button
        as='a'
        href='/'
        radius={8}
        width={90}
        paddingVertical={20}
        onClick={handleButtonClick}
        className={cn('test')}
      >
        button
      </Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <WriteEditModal reviewType='otherReview' onSuccessReview={handleSuccessReview} productData={PRODUCT_DATA} />
      </Modal>
    </div>
  );
}
