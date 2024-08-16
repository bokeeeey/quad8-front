'use client';

import { Button, Modal } from '@/components';
import WriteEditModal from '@/components/WriteEditModal/WriteEditModal';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './ReviewModalTest.module.scss';

const cn = classNames.bind(styles);

export default function ReviewModalTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(false);
  };

  const PRODUCT_DATA = {
    productId: 125,
    orderId: 188,
    option: '바이올렛축',
    productImgUrl: 'https://cdn.imweb.me/thumbnail/20220404/12007f769b366.jpg',
    productName: '게이트론 무보강 스테빌라이저(스크류/나사 체결)',
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
        <WriteEditModal reviewType='productReview' onSuccessReview={handleSuccessReview} productData={PRODUCT_DATA} />
      </Modal>
    </div>
  );
}
