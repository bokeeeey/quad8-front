import type { ShippingAddressResponse } from '@/types/orderType';
import type { UserAddress } from '@/types/shippingType';
import { useEffect, useState } from 'react';

interface UseSelectedAddressProps {
  paymentResponse?: { data: { shippingAddressResponse: ShippingAddressResponse | null } };
}

export const useSelectedAddress = ({ paymentResponse }: UseSelectedAddressProps) => {
  const [selectedAddress, setSelectedAddress] = useState(paymentResponse?.data.shippingAddressResponse ?? null);

  useEffect(() => {
    if (paymentResponse) {
      setSelectedAddress(paymentResponse.data.shippingAddressResponse);
    }
  }, [paymentResponse]);

  const onSelectAddress = (selectItem: UserAddress) => {
    setSelectedAddress(selectItem);
  };

  return { selectedAddress, onSelectAddress };
};
