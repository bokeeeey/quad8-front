import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { BaseSyntheticEvent, useState } from 'react';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';

import { postAddress } from '@/api/shippingAPI';
import type { ShippingAddressResponse } from '@/types/paymentTypes';
import type { UserAddress } from '@/types/shippingType';

import AddAddressModal from '@/app/my-info/(account)/addresses/_components/AddAddresseModal/AddAddressModal';
import { Button, Dropdown, Modal } from '@/components';
import CheckoutAddressModal from './CheckoutAddressModal';

import styles from './CheckoutAddress.module.scss';

const cn = classNames.bind(styles);

const DELIVERY_OPTIONS = ['부재시 문앞에 놓아주세요.', '경비실에 맡겨 주세요', '직접 입력'];

interface CheckoutAddressProps {
  item: ShippingAddressResponse;
}

export default function CheckoutAddress({ item }: CheckoutAddressProps) {
  const [isAddressChangeModalOpen, setIsAddressChangeModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(item);
  const [isAddAddressModal, setIsAddAddressModal] = useState(false);
  const [isPostcodeEmbedOpen, setIsPostcodeEmbedOpen] = useState(false);
  const [addressData, setAddressData] = useState<Address | null>(null);

  const queryClient = useQueryClient();

  const { address, detailAddress, name, phone } = selectedAddress;

  const { mutate: postAddressesMutate } = useMutation({
    mutationFn: postAddress,
  });

  const handleAddressButtonClick = () => {
    setIsAddressChangeModalOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleAddAddressButtonClick = () => {
    setIsAddAddressModal((prevIsOpen) => !prevIsOpen);
  };

  const handleAddressClick = (selectItem: UserAddress) => {
    setSelectedAddress(selectItem);
    setIsAddressChangeModalOpen((prevIsOpen) => !prevIsOpen);
  };

  const onSuccessClose = () => {
    setIsAddAddressModal((prevIsOpen) => !prevIsOpen);
    setAddressData(null);
  };

  const handleComplete = (data: Address) => {
    setIsPostcodeEmbedOpen(false);
    setAddressData(data);
  };

  const handleAddAddressModalClose = () => {
    setIsAddAddressModal(false);
    setAddressData(null);
  };

  const handleSearchPostClick = () => {
    setIsPostcodeEmbedOpen(true);
  };

  const handleAddressPostSubmit: SubmitHandler<FieldValues> = (payload, e?: BaseSyntheticEvent) => {
    e?.stopPropagation();

    postAddressesMutate(payload, {
      onSuccess: (res) => {
        if (res.status === 'SUCCESS') {
          toast('배송지를 추가하였습니다.');
          queryClient.invalidateQueries({ queryKey: ['addressesData'] });
          onSuccessClose();
        }
      },
    });
  };

  return (
    <>
      <div className={cn('address-section')}>
        <div className={cn('address-title-box')}>
          <h1>배송 주소</h1>
          <button className={cn('address-title-button')} type='button' onClick={handleAddAddressButtonClick}>
            + 새 주소 추가
          </button>
        </div>
        <div className={cn('address-box')}>
          <div className={cn('address-wrap')}>
            <div className={cn('address-key')}>
              <p>받는분</p>
              <p>연락처</p>
              <p>배송 주소</p>
            </div>
            <div className={cn('address-value')}>
              <p>{name}</p>
              <p>{phone}</p>
              <p>
                {address} {detailAddress}
              </p>
            </div>
          </div>
          <Button type='button' paddingVertical={8} width={72} radius={4} onClick={handleAddressButtonClick}>
            변경
          </Button>
        </div>
        <Dropdown
          options={DELIVERY_OPTIONS}
          name='드롭다운2'
          sizeVariant='sm'
          placeholder='배송 요청 사항을 선택해 주세요.'
        />
      </div>

      <Modal isOpen={isAddressChangeModalOpen} onClose={() => setIsAddressChangeModalOpen(false)}>
        <CheckoutAddressModal onClick={handleAddressClick} />
      </Modal>

      <Modal isOpen={isPostcodeEmbedOpen} onClose={() => setIsPostcodeEmbedOpen(false)}>
        <DaumPostcodeEmbed
          className={cn('postcode-embed')}
          style={{ width: '530px', height: '600px' }}
          onComplete={handleComplete}
        />
      </Modal>
      <Modal isOpen={isAddAddressModal} onClose={handleAddAddressModalClose}>
        <AddAddressModal
          newAddressData={addressData}
          onClick={handleSearchPostClick}
          onSubmit={handleAddressPostSubmit}
        />
      </Modal>
    </>
  );
}
