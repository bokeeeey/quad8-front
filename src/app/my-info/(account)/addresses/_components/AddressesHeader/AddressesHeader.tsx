'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Address, DaumPostcodeEmbed } from 'react-daum-postcode';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import { postAddress } from '@/api/shippingAPI';
import { AddAddresseModal, Button, Modal } from '@/components';

import styles from './AddressesHeader.module.scss';

const cn = classNames.bind(styles);

export default function AddressesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostcodeEmbedOpen, setIsPostcodeEmbedOpen] = useState(false);
  const [addressData, setAddressData] = useState<Address | null>(null);

  const queryClient = useQueryClient();

  const { mutate: postAddressesMutate } = useMutation({
    mutationFn: postAddress,
  });

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleSearchPostClick = () => {
    setIsPostcodeEmbedOpen(true);
  };

  const handleComplete = (data: Address) => {
    setIsPostcodeEmbedOpen(false);
    setAddressData(data);
  };

  const handleAddAddressModalClose = () => {
    setIsModalOpen(false);
    setAddressData(null);
  };

  const handleSuccessClose = () => {
    setIsModalOpen(false);
    setAddressData(null);
  };

  const handleAddressPostSubmit: SubmitHandler<FieldValues> = (payload) => {
    postAddressesMutate(payload, {
      onSuccess: () => {
        toast('배송지를 추가하였습니다.');
        queryClient.invalidateQueries({ queryKey: ['addressesData'] });
        handleSuccessClose();
      },
      onError: (error) => {
        toast(error.message);
      },
    });
  };

  return (
    <>
      <div className={cn('header')}>
        <h1 className={cn('title')}>주소록</h1>
        <Button className={cn('button')} radius={4} paddingVertical={8} onClick={handleButtonClick}>
          <span className={cn('cross-icon')}>+</span>배송지 추가
        </Button>
      </div>

      <Modal isOpen={isPostcodeEmbedOpen} onClose={() => setIsPostcodeEmbedOpen(false)}>
        <DaumPostcodeEmbed
          className={cn('postcode-embed')}
          style={{ width: '530px', height: '600px' }}
          onComplete={handleComplete}
        />
      </Modal>
      <Modal isOpen={isModalOpen} onClose={handleAddAddressModalClose}>
        <AddAddresseModal
          onClick={handleSearchPostClick}
          onSubmit={handleAddressPostSubmit}
          newAddressData={addressData}
        />
      </Modal>
    </>
  );
}
