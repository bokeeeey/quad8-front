import classNames from 'classnames/bind';
import { MouseEvent, useContext, useState, useRef, RefObject } from 'react';
import { StaticImageData } from 'next/image';

import { KeyboardDataContext, StepContext } from '@/context/customKeyboardContext';
import { POINT_KEY } from '@/constants/keyboardData';
import type { CustomKeyboardStepTypes, OptionDataType } from '@/types/CustomKeyboardTypes';
import { blackSwitchImg, blueSwitchImg, brownSwitchImg, redSwitchImg } from '@/public/index';
import { Button } from '@/components';
import { getColorUpperCase } from '@/libs/getColorUpperCase';
import { getCustomKeyboardPrice } from '@/libs/getCustomKeyboardPrice';
import CartModalOptionCard from './parts/CartModalOptionCard';
import CartModalToast from './parts/CartModalToast';

import styles from './CartModal.module.scss';

const cn = classNames.bind(styles);

interface CartModalProps {
  optionData: OptionDataType[];
  onClose: () => void;
}

interface OrderListType {
  name: string;
  option1: string;
  option2?: boolean;
  price: number;
  count: number;
  imageSrc: string | StaticImageData;
  step: CustomKeyboardStepTypes;
  wrapperRef?: RefObject<HTMLDivElement>;
}

const SWITCH_LIST = {
  청축: blueSwitchImg,
  적축: redSwitchImg,
  갈축: brownSwitchImg,
  흑축: blackSwitchImg,
};

export default function CartModal({ optionData, onClose }: CartModalProps) {
  const orderWrapperRef = useRef<HTMLDivElement>(null);
  const [dataStatus, setDataStatus] = useState<null | 'pending' | 'completed'>(null);
  const {
    keyboardData: {
      type,
      texture,
      switchType,
      boardColor,
      baseKeyColor,
      hasPointKeyCap,
      pointKeyType,
      individualColor,
      price,
      option,
    },
    updateOption,
    updatePrice,
  } = useContext(KeyboardDataContext);

  const { keyboardImage, updateCurrentStep, updateStepStatus } = useContext(StepContext);

  const { boardPrice, keyCapPrice } = getCustomKeyboardPrice({
    type,
    texture,
    hasPointKeyCap,
    pointKeyType,
    individualColor,
  });
  const pointKeyCount = pointKeyType === '내 맘대로 바꾸기' ? Object.keys(individualColor).length : POINT_KEY.length;

  const isOverFlow = (option ? Object.entries(option).filter((element) => element[1]).length : 0) > 1;
  const buttonDisabled = dataStatus !== null;

  const ORDER_LIST: OrderListType[] = [
    {
      name: '키득 베어본',
      option1: `${type} / ${getColorUpperCase(boardColor)} / ${texture}`,
      price: boardPrice,
      count: 0,
      imageSrc: keyboardImage.board,
      step: 'board',
    },
    {
      name: '키득 스위치',
      option1: switchType as string,
      price: 0,
      count: 0,
      imageSrc: switchType ? SWITCH_LIST[switchType] : '',
      step: 'switch',
    },
    {
      name: '키득 키캡',
      option1: `${getColorUpperCase(baseKeyColor)} / 포인트 키캡${hasPointKeyCap ? `o / ${pointKeyType}` : 'x'}`,
      option2: hasPointKeyCap,
      price: keyCapPrice,
      count: !hasPointKeyCap ? 0 : pointKeyCount,
      imageSrc: keyboardImage.keyCap,
      step: 'keyCap',
      wrapperRef: orderWrapperRef,
    },
  ];

  const handleClickPutButton = () => {
    setDataStatus('pending');
    /* api 보내는 코드 */
    setTimeout(() => {
      setDataStatus('completed');
    }, 1500);
  };

  const onClickEditButton = (e: MouseEvent<HTMLButtonElement>, step: CustomKeyboardStepTypes) => {
    e.stopPropagation();
    onClose();
    if (step !== 'keyCap') {
      updateStepStatus({ [step]: 'current', keyCap: 'completed' });
    }
    updateCurrentStep(step);
  };

  const onClickDeleteButton = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    // eslint-disable-next-line no-alert
    if (window.confirm('정말 삭제하시겠습니까?')) {
      updateOption(id, false);
      const deleteOptionCost = optionData.find((element) => element.id === id)?.price as number;
      updatePrice(-deleteOptionCost);
      // eslint-disable-next-line no-alert
      alert('삭제되었습니다');
    }
  };

  return (
    <div className={cn('wrapper', { overflow: isOverFlow })}>
      <div className={cn('head-wrapper', { 'header-overflow': isOverFlow })}>
        <p className={cn('title')}>담은 상품</p>
      </div>
      <div className={cn('content-wraper')}>
        <div className={cn('order-wrapper')} ref={orderWrapperRef}>
          {ORDER_LIST.map((element) => (
            <CartModalOptionCard
              key={element.name}
              name={element.name}
              option1={element.option1}
              option2={element.option2}
              buttonType='edit'
              price={element.price}
              count={element.count}
              imageSrc={element.imageSrc}
              buttonOnClick={(e) => onClickEditButton(e, element.step)}
              wrapperRef={orderWrapperRef}
            />
          ))}
          {option &&
            optionData.map(
              (element) =>
                option[element.id] && (
                  <CartModalOptionCard
                    key={element.id}
                    name='기타 용품'
                    option1={element.name}
                    price={element.price}
                    imageSrc={element.image}
                    buttonType='delete'
                    buttonOnClick={(e) => onClickDeleteButton(e, element.id)}
                  />
                ),
            )}
        </div>
        <div className={cn('count-price-wrapper')}>
          <p className={cn('count')}>총 합계</p>
          <p className={cn('price')}>{price.toLocaleString()}원</p>
        </div>
      </div>
      <div className={cn('button-wrapper')}>
        <Button
          className={cn({ disabled: buttonDisabled })}
          onClick={handleClickPutButton}
          disabled={buttonDisabled}
          hoverColor='background-primary-60'
        >
          장바구니 담기
        </Button>
      </div>
      {dataStatus === 'completed' && <CartModalToast />}
    </div>
  );
}