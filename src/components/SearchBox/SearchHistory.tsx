import { MouseEvent } from 'react';
import classNames from 'classnames/bind';

import { DeleteIcon } from '@/public/index';

import styles from './SearchHistory.module.scss';

const cn = classNames.bind(styles);

interface SearchHistoryProps {
  historyData: string[];
  focusIndex: number;
  isBlack: boolean;
  onClickKeyword: (value: string) => void;
  onClickDelete: (value: string) => void;
  onClickDeleteAll: () => void;
  onFocusKeyword: (value: number) => void;
}

export default function SearchHistory({
  historyData,
  isBlack,
  focusIndex,
  onClickKeyword,
  onClickDelete,
  onClickDeleteAll,
  onFocusKeyword,
}: SearchHistoryProps) {
  const handleClickKeyword = (value: string) => {
    onClickKeyword(value);
  };

  const handleClickDelete = (e: MouseEvent<HTMLButtonElement>, value: string) => {
    e.stopPropagation();
    onClickDelete(value);
  };

  const handleClickDeleteAll = () => {
    onClickDeleteAll();
  };

  return (
    <div className={cn('wrapper', { 'bg-black': isBlack })}>
      <div className={cn('title-wrapper')}>
        <div className={cn('title')}>최근 검색어</div>
        {historyData.length > 0 && (
          <button type='button' className={cn('delete-all')} onClick={handleClickDeleteAll}>
            전체 삭제
          </button>
        )}
      </div>
      {historyData.length ? (
        <div className={cn('history-wrapper')}>
          {historyData.slice(0, 7).map((keyword, index) => (
            <div
              key={keyword}
              className={cn('history-item-wrapper', {
                'bg-black': isBlack,
                focus: index === focusIndex,
                'focus-black': index === focusIndex && isBlack,
              })}
              onMouseEnter={() => onFocusKeyword(index)}
              onMouseLeave={() => onFocusKeyword(-1)}
              onClick={() => handleClickKeyword(keyword)}
            >
              <div className={cn('keyword')}>{keyword}</div>
              <button type='button' onClick={(e) => handleClickDelete(e, keyword)} className={cn('delete-button')}>
                <DeleteIcon width={24} height={24} className={cn('delete-icon')} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={cn('hollow-wrapper')}>최근 검색어 내역이 없습니다.</div>
      )}
    </div>
  );
}
