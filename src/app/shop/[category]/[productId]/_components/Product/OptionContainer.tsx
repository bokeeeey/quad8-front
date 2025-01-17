import { CountInput } from '@/components';
import { DeleteIcon } from '@/public/index';
import classNames from 'classnames/bind';
import { useCallback } from 'react';
import styles from './ProductDetail.module.scss';

const cn = classNames.bind(styles);

interface OptionContainerProps {
  optionText?: string;
  price?: number;
  count: number;
  updateCount: (count: number) => void;
  deleteOption: () => void;
}

export default function OptionContainer({ optionText, price, count, updateCount, deleteOption }: OptionContainerProps) {
  const handleUpdateCount = useCallback(
    (value: number) => {
      updateCount(value);
    },
    [updateCount],
  );
  return (
    <div className={cn('option-box')}>
      <h3 className={cn('option-text')}>{optionText}</h3>
      <div className={cn('option-count')}>
        <CountInput value={count} onChange={handleUpdateCount} />
      </div>
      <h3 className={cn('option-price')}>{price?.toLocaleString()}원</h3>
      <DeleteIcon className={cn('delete-icon')} onClick={deleteOption} />
    </div>
  );
}
