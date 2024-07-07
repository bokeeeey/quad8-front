/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { renderPaymentProductName } from '@/libs/renderPaymentProductName';
import type { OrderDetailData } from '@/types/paymentTypes';
import type { Users } from '@/types/userType';
import { useQuery } from '@tanstack/react-query';
import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';

interface PaymentContainerProps {
  amountValue: number;
  paymentData?: OrderDetailData;
}

interface WidgetPaymentMethodWidget {
  on: (eventName: 'paymentMethodSelect', callback: (paymentMethod: { code: string }) => void) => void;
  getSelectedPaymentMethod: () => Promise<{ code: string }>;
  destroy: () => Promise<void>;
}

interface TossPaymentsWidgets {
  setAmount: (amount: { currency: string; value: number }) => Promise<void>;
  renderPaymentMethods: (params: { selector: string; variantKey?: string }) => Promise<WidgetPaymentMethodWidget>;
  renderAgreement: (params: { selector: string; variantKey?: string }) => Promise<void>;
  requestPayment: (params: {
    orderId: string;
    orderName: string;
    customerName?: string;
    customerEmail?: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
}

// const generateRandomString = () => window.btoa(Math.random().toString()).slice(0, 20);
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

export function PaymentContainer({ amountValue, paymentData }: PaymentContainerProps) {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  // const [amount, setAmount] = useState({
  //   currency: 'KRW',
  //   value: 0,
  // });

  const { data: userDataResponse } = useQuery<{ data: Users }>({ queryKey: ['userData'] });

  const { nickname: customerName, email: customerEmail } = userDataResponse?.data ?? {};

  const { paymentOrderId: orderId, orderItemResponses = [] } = paymentData ?? {};

  const orderName = renderPaymentProductName({ orderItemResponses });

  useEffect(() => {
    const fetchPaymentWidgets = async () => {
      const tossPayments = await loadTossPayments(clientKey);
      const widgetsInstance = tossPayments.widgets({ customerKey: ANONYMOUS }) as unknown as TossPaymentsWidgets;
      setWidgets(widgetsInstance);
    };

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    const renderPaymentWidgets = async () => {
      if (widgets == null) return;

      await widgets.setAmount({
        currency: 'KRW',
        value: amountValue,
      });

      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });

      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });

      setReady(true);
    };

    renderPaymentWidgets();
  }, [widgets, amountValue]);

  const handlePayment = async () => {
    if (!ready || widgets == null) return;

    try {
      await widgets.requestPayment({
        orderId: orderId || '',
        orderName,
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        successUrl: `${window.location.origin}/sandbox/success${window.location.search}`,
        failUrl: `${window.location.origin}/sandbox/fail${window.location.search}`,
      });
    } catch (error) {
      // TODO: 에러 처리
    }
  };

  return (
    <div className='wrapper w-100'>
      <div className='max-w-540 w-100'>
        <div id='payment-method' className='w-100' />
        <div id='agreement' className='w-100' />
        <div className='btn-wrapper w-100'>
          <button type='button' className='btn primary w-100' onClick={handlePayment}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
