'use client';

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getSearchSuggestion } from '@/api/search';
import { SearchIcon } from '@/public/index';
import { ROUTER } from '@/constants/route';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { charMatcher } from '@/libs/charMatcher';
import SearchHistory from './SearchHistory';

import styles from './SearchBox.module.scss';
import SearchSuggestion from './SearchSuggestion';

const cn = classNames.bind(styles);

interface SearchBoxProps {
  isBlack: boolean;
}

export default function SearchBox({ isBlack }: SearchBoxProps) {
  const router = useRouter();
  const pathName = usePathname();

  const { data: SearchSuggestionData } = useQuery<string[]>({
    queryFn: getSearchSuggestion,
    queryKey: ['searchSuggestionData'],
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [originKeyword, setOriginKeyword] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [autoListType, setAutoListType] = useState<'history' | 'suggestion'>('history');
  const [focusIndex, setFocusIndex] = useState(-1);

  const [keywordHistory, setKeywordHistory] = useState<string[]>([]);
  const [keywordSuggestion, setKeywordSuggestion] = useState<string[]>([]);

  /* 외부 클릭 시 focus 해제(자동 완성 리스트 안 뜨도록 설정 => 클릭한 곳이 suggestRef 내부일 경우 제외) */
  useOutsideClick(inputRef, (e?: MouseEvent) => {
    if (e && suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
      setIsFocus(false);
    }
  });

  /* 헤더 검색버튼 눌렀을 때 검색 컴포넌트 뜨도록 설정(열 때는 isRender도 같이 true로 바로 바뀌도록 설정) */
  const handleClickButton = () => {
    setIsOpen((prev) => {
      if (!prev) {
        setIsRender(true);
      }
      return !prev;
    });
  };

  /* 
    검색 컴포넌트 unmount 요청 시(isOpen값이 false로 바뀔 때)에 animation이 발생하고 다 끝난 후에 unmount되도록 하기 위한 코드. 
    애니메이션이 종료된 후 isOpen이 false 일 때(사용자가 닫는 조건을 발동시켰을 때 - 외부 클릭 또는 헤더 검색 버튼을 누른 경우 ) unmount 되도록 설정
    참고로 애니메이션은 처음에 isOpen이 true로 변경될 때 또는 false로 변경될 때 발동되며(slide-in, slide-out),
    닫히는 경우, isOpen이 false로 변경되고, 애니메이션이 일어난 후, unmount되어야 함(isRender가 false)
  */
  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsRender(false);
    }
  };

  /* 
    회색 배경 부분 클릭 했을 경우 검색 컴포넌트 닫히도록 설정
    만약 헤더 클릭 했을 때도 닫히도록 하려면 그냥 useOutsideClick으로 하면 됨.
  */
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      handleClickButton();
    }
  };

  const suggestionFilter = (keyword: string) => {
    if (!SearchSuggestionData) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setKeywordSuggestion(
        SearchSuggestionData.filter((name) => charMatcher(keyword.toLowerCase()).test(name.toLocaleLowerCase())),
      );
      timerRef.current = null;
    }, 200);
  };

  /* input 값 변경 함수. 만약 값이 비어있을 경우, 최근 검색어 내역이 뜨도록 설정 */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    if (!e.target.value) {
      setAutoListType('history');
      return;
    }
    setAutoListType('suggestion');
    suggestionFilter(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocus(true);
  };

  /* 
    위, 아래 버튼 클릭 시에 해당 keyword focus되도록 설정 -> 최근 검색어 또는 검색어 제안의 값을 바로 가져올 수 있도록 설정
    focusIndex를 키보드 입력을 했을 때 해당 선택 값으로 변경하고, searchKeyword 값을 해당 값으로 변경.
    input의 selectionRange(커서 위치)를 해당 텍스트 가장 마지막으로 변경.
    가장 마지막 또는 가장 처음에서 화살표 아래 또는 위를 누를 경우, focusIndex를 -1로 변경하고 keyword값 초기화/이전 값 불러오기
    -1인 상태에서 누를 경우 가장 처음 또는 가장 마지막으로 focus 이동
  */
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (value === 'ArrowDown') {
      e.preventDefault();
      setFocusIndex((prev) => {
        if (autoListType === 'history') {
          if (Math.min(keywordHistory.length - 1, 6) <= prev) {
            setSearchKeyword('');
            return -1;
          }

          setSearchKeyword(keywordHistory[prev + 1]);
          inputRef.current?.setSelectionRange(keywordHistory[prev + 1].length, null);
          return prev + 1;
        }

        if (prev === -1) {
          setOriginKeyword(searchKeyword);
        }

        if (Math.min(keywordSuggestion.length - 1, 6) <= prev) {
          setSearchKeyword(originKeyword);
          return -1;
        }
        setSearchKeyword(keywordSuggestion[prev + 1]);
        inputRef.current?.setSelectionRange(keywordSuggestion[prev + 1].length, null);
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
            const lastIndex = Math.min(keywordHistory.length - 1, 6);
            setSearchKeyword(keywordHistory[lastIndex]);
            inputRef.current?.setSelectionRange(null, keywordHistory[lastIndex].length);
            return lastIndex;
          }

          setSearchKeyword(keywordHistory[prev - 1]);
          inputRef.current?.setSelectionRange(null, keywordHistory[prev - 1].length);

          return prev - 1;
        }
        if (prev === 0) {
          setSearchKeyword(originKeyword);
          inputRef.current?.setSelectionRange(null, originKeyword.length);
          return -1;
        }
        if (prev === -1) {
          const lastIndex = Math.min(keywordSuggestion.length - 1, 6);
          setSearchKeyword(keywordSuggestion[lastIndex]);
          inputRef.current?.setSelectionRange(null, keywordSuggestion[lastIndex].length);
          return lastIndex;
        }
        setSearchKeyword(keywordSuggestion[prev - 1]);
        inputRef.current?.setSelectionRange(null, keywordSuggestion[prev - 1].length);

        return prev - 1;
      });
    }
  };

  /* 
    input값 제출 => search페이지로 이동 -> 해당 input 값을 쿼리로 변경.
    최근 검색어 저장
  */
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRender(false);
    setKeywordHistory((prev) => {
      const newValue = [searchKeyword, ...prev.filter((keyword) => keyword !== searchKeyword)];
      localStorage.setItem('recentSearch', JSON.stringify(newValue));
      return newValue;
    });
    router.push(`${ROUTER.SEARCH}?keyword=${searchKeyword}`, { scroll: false });
  };

  const handleSugestionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* 
    최근 검색어 클릭 함수
    마찬가지로 해당 값으로 search페이지 이동.
    최근 검색어 저장(순서 변경?)
  */
  const handleClickHistoryKeyword = (value: string) => {
    setIsRender(false);
    setKeywordHistory((prev) => {
      const newValue = [value, ...prev.filter((keyword) => keyword !== value)];
      localStorage.setItem('recentSearch', JSON.stringify(newValue));
      return newValue;
    });
    router.push(`${ROUTER.SEARCH}?keyword=${value}`, { scroll: false });
  };

  /* 최근 검색어 요소 하나 삭제 함수 */
  const handleClickDeleteHistory = (value: string) => {
    setKeywordHistory((prev) => {
      const newValue = [...prev.filter((keyword) => keyword !== value)];
      localStorage.setItem('recentSearch', JSON.stringify(newValue));
      return newValue;
    });
  };

  /* 최근 검색어 전체 삭제 함수 */
  const handleClickDeleteAllHistory = () => {
    setKeywordHistory([]);
    localStorage.setItem('recentSearch', '[]');
  };

  /* mouse hover시에 focusIndex 업데이트를 위한 함수 */
  const handleFocusKeyword = (index: number) => {
    setFocusIndex(index);
  };

  const handleClickSuggestionKeyword = (value: string) => {
    setIsRender(false);
    setKeywordHistory((prev) => {
      const newValue = [value, ...prev.filter((keyword) => keyword !== searchKeyword)];
      localStorage.setItem('recentSearch', JSON.stringify(newValue));
      return newValue;
    });
    router.push(`${ROUTER.SEARCH}?keyword=${value}`, { scroll: false });
  };

  /* 페이지 이동 시 검색 컴포넌트 안보이도록 변경 */
  useEffect(() => {
    setIsRender(false);
  }, [pathName]);

  /* 검색 컴포넌트가 열고 닫힐 때, 값이 초기화 되도록 설정 */
  useEffect(() => {
    setIsFocus(false);
    setSearchKeyword('');
    setAutoListType('history');
  }, [isRender]);

  /* 아웃 포커스 되었을 때, 자동 완성창이 사라졌을 때 focusIndex 값도 초기화 되도록 설정 */
  useEffect(() => {
    setFocusIndex(-1);
  }, [isFocus, autoListType]);

  useEffect(() => {
    setKeywordHistory(JSON.parse(localStorage.getItem('recentSearch') ?? '[]'));
  }, []);

  return (
    <div>
      <SearchIcon width={24} height={24} className={cn('icon', { black: isBlack })} onClick={handleClickButton} />
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
                <div className={cn('auto-list-wrapper')} onClick={handleSugestionClick} ref={suggestRef}>
                  {autoListType === 'suggestion' ? (
                    keywordSuggestion.length > 0 && (
                      <SearchSuggestion
                        suggestionData={keywordSuggestion}
                        focusIndex={focusIndex}
                        isBlack={isBlack}
                        onClickKeyword={handleClickSuggestionKeyword}
                        onFocusKeyword={handleFocusKeyword}
                      />
                    )
                  ) : (
                    <SearchHistory
                      historyData={keywordHistory}
                      isBlack={isBlack}
                      focusIndex={focusIndex}
                      onClickKeyword={handleClickHistoryKeyword}
                      onClickDelete={handleClickDeleteHistory}
                      onClickDeleteAll={handleClickDeleteAllHistory}
                      onFocusKeyword={handleFocusKeyword}
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
