import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getAddresses } from '@/api/shippingAPI';
import { Address, AddressesEmptyCase } from '@/app/my-info/(account)/addresses/_components/Addresses';
import type { UserAddress } from '@/types/shippingType';

import styles from './CheckoutAddressModal.module.scss';

const cn = classNames.bind(styles);

interface CheckoutAddressModalProps {
  onClick: (item: UserAddress) => void;
}

export default function CheckoutAddressModal({ onClick }: CheckoutAddressModalProps) {
  const { data: addressesData } = useQuery<{ data: UserAddress[] }>({
    queryKey: ['addressesData'],
    queryFn: getAddresses,
  });

  const addresses = addressesData?.data ?? [];
  const sortedAddresses = [...addresses].sort((a, b) => (b.isDefault ? 1 : -1) - (a.isDefault ? 1 : -1));

  return (
    <article className={cn('container')}>
      <h1 className={cn('title')}>주소록</h1>
      <div className={cn('addresses')}>
        {addresses.length > 0 ? (
          sortedAddresses?.map((item) => <Address item={item} key={item.id} isDisplayOnModal onClick={onClick} />)
        ) : (
          <AddressesEmptyCase />
        )}
      </div>
    </article>
  );
}
