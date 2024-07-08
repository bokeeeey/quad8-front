import classNames from 'classnames/bind';

import styles from './SearchSuggestion.module.scss';

const cn = classNames.bind(styles);

interface SearchSuggestionProps {
  suggestionData: string[];
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
      {suggestionData.slice(0, 7).map((keyword, i) => (
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
          {keyword}
        </div>
      ))}
    </div>
  );
}
