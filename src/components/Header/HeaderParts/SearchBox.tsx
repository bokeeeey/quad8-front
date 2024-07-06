'use client';

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames/bind';

import { SearchIcon } from '@/public/index';

import { ROUTER } from '@/constants/route';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import SearchHistory from './SearchHistory';

import styles from './SearchBox.module.scss';

const cn = classNames.bind(styles);

interface SearchBoxProps {
  isBlack: boolean;
}

export default function SearchBox({ isBlack }: SearchBoxProps) {
  const router = useRouter();
  const pathName = usePathname();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [autoListType, setAutoListType] = useState<'history' | 'suggestion'>('history');
  const [focusIndex, setFocusIndex] = useState(-1);

  const [keywordHistory, setKeywordHistory] = useState(['aaa', 'bbb', 'ccc', 'ddd']);

  useOutsideClick(inputRef, (e?: MouseEvent) => {
    if (e && suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
      setIsFocus(false);
    }
  });

  const handleClickButton = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setIsRender(true);
      }

      return !prev;
    });
  };

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsRender(false);
    }
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      handleClickButton();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    if (!e.target.value) {
      setAutoListType('history');
      return;
    }
    setAutoListType('suggestion');
  };

  const handleInputFocus = () => {
    setIsFocus(true);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (value === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex((prev) => {
        if (autoListType === 'history') {
          if (keywordHistory.length - 1 <= prev) {
            setSearchKeyword('');
            return -1;
          }

          setSearchKeyword(keywordHistory[prev + 1]);
          inputRef.current?.setSelectionRange(keywordHistory[prev + 1].length, null);
          return prev + 1;
        }
        return prev + 1;
      });
    }
    if (value === 'ArrowUp') {
      e.preventDefault();
      setFocusIndex((prev) => {
        if (autoListType === 'history') {
          if (prev === 0) {
            setSearchKeyword('');
            inputRef.current?.setSelectionRange(0, null);
            return -1;
          }
          if (prev === -1) {
            const lastIndex = keywordHistory.length - 1;
            setSearchKeyword(keywordHistory[lastIndex]);
            inputRef.current?.setSelectionRange(null, keywordHistory[lastIndex].length);
            return lastIndex;
          }
          setSearchKeyword(keywordHistory[prev - 1]);
          inputRef.current?.setSelectionRange(null, keywordHistory[prev - 1].length);

          return prev - 1;
        }
        return prev - 1;
      });
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRender(false);
    router.push(`${ROUTER.SEARCH}?keyword=${searchKeyword}`, { scroll: false });
  };

  const handleSugestionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClickHistoryKeyword = (index: number) => {
    setIsRender(false);
    router.push(`${ROUTER.SEARCH}?keyword=${keywordHistory[index]}`, { scroll: false });
  };

  const handleClickDeleteHistory = (index: number) => {
    setKeywordHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClickDeleteAllHistory = () => {
    setKeywordHistory([]);
  };

  const handleFocuseHistoryKeyword = (index: number) => {
    setFocusIndex(index);
  };

  useEffect(() => {
    setIsRender(false);
  }, [pathName]);

  useEffect(() => {
    setIsFocus(false);
    setSearchKeyword('');
    setAutoListType('history');
  }, [isRender]);

  useEffect(() => {
    setFocusIndex(-1);
  }, [isFocus, autoListType]);

  return (
    <div>
      <button type='button' onClick={handleClickButton}>
        <SearchIcon width={31} height={31} className={cn('icon', { black: isBlack })} />
      </button>

      {isRender && (
        <div
          className={cn('search-wrapper', { 'fade-out': !isOpen, 'border-black': isBlack })}
          onClick={handleClickOutside}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className={cn('wrapper', { 'slide-out': !isOpen, 'bg-black': isBlack })} ref={wrapperRef}>
            <div className={cn('content-wrapper')} onFocus={handleInputFocus}>
              <form className={cn('form', { 'bg-black': isBlack })} onSubmit={handleFormSubmit}>
                <input
                  ref={inputRef}
                  value={searchKeyword}
                  className={cn('input', { 'bg-black': isBlack })}
                  placeholder='검색어를 입력해주세요'
                  onFocus={handleInputFocus}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                />
                <button type='submit'>
                  <SearchIcon
                    width={31}
                    height={31}
                    className={cn('search-button', { 'search-button-black': isBlack })}
                  />
                </button>
              </form>
              {isFocus && (
                <div
                  className={cn('auto-list-wrapper', { 'bg-black': isBlack })}
                  onClick={handleSugestionClick}
                  ref={suggestRef}
                >
                  {autoListType === 'suggestion' ? (
                    <div>검색어 제안</div>
                  ) : (
                    <SearchHistory
                      historyData={keywordHistory}
                      isBlack={isBlack}
                      focusIndex={focusIndex}
                      onClickKeyword={handleClickHistoryKeyword}
                      onClickDelete={handleClickDeleteHistory}
                      onClickDeleteAll={handleClickDeleteAllHistory}
                      onFocusKeyword={handleFocuseHistoryKeyword}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
