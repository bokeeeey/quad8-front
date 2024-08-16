import classNames from 'classnames/bind';

import type { SuggestionDataType } from '@/types/searchType';
import styles from './SearchSuggestion.module.scss';

const cn = classNames.bind(styles);

interface SearchSuggestionProps {
  suggestionData: SuggestionDataType[];
  focusIndex: number;
  isBlack: boolean;
  onFocusKeyword: (value: number) => void;
  onClickKeyword: (value: string) => void;
}

export default function SearchSuggestion({
  suggestionData,
  focusIndex,
  isBlack,
  onFocusKeyword,
  onClickKeyword,
}: SearchSuggestionProps) {
  const handleClickKeyword = (value: string) => {
    onClickKeyword(value);
  };

  return (
    <div className={cn('wrapper', { 'bg-black': isBlack })}>
      {suggestionData.slice(0, 7).map(({ name: keyword, range }, i) => (
        <div
          className={cn('suggestion-wrapper', {
            focus: focusIndex === i,
            'bg-black': isBlack,
            'focus-black': focusIndex === i && isBlack,
          })}
          key={keyword}
          onMouseEnter={() => onFocusKeyword(i)}
          onMouseLeave={() => onFocusKeyword(-1)}
          onClick={() => handleClickKeyword(keyword)}
        >
          {range[0] !== 0 && keyword.substring(0, range[0])}
          <span className={cn(isBlack ? 'highlight-black' : 'highlight')}>{keyword.substring(range[0], range[1])}</span>
          {range[1] !== keyword.length - 1 && keyword.substring(range[1])}
        </div>
      ))}
    </div>
  );
}
