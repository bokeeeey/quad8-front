'use client';

import classNames from 'classnames/bind';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@/public/index';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTER } from '@/constants/route';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import styles from './SearchBox.module.scss';

const cn = classNames.bind(styles);

interface SearchBoxProps {
  isBlack: boolean;
}

export default function SearchBox({ isBlack }: SearchBoxProps) {
  const router = useRouter();
  const pathName = usePathname();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  useOutsideClick(inputRef, (e?: MouseEvent) => {
    if (!e) {
      return;
    }

    if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
      setIsFocus(false);
    }
  });

  const handleClickButton = () => {
    setIsOpen((prev) => {
      if (prev) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setTimeout(() => {
          setIsRender(!prev);
          timerRef.current = null;
        }, 300);
      } else {
        setIsRender(!prev);
      }

      return !prev;
    });
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      handleClickButton();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocus(true);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`${ROUTER.SEARCH}?keyword=${searchKeyword}`, { scroll: false });
  };

  const handleSugestionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    setIsRender(false);
  }, [pathName]);

  useEffect(() => {
    setIsFocus(false);
  }, [isRender]);

  return (
    <div>
      <button type='button' onClick={handleClickButton}>
        <SearchIcon width={31} height={31} className={cn('icon', { black: isBlack })} />
      </button>

      {isRender && (
        <div
          className={cn('search-wrapper', { 'fade-out': !isOpen, 'border-black': isBlack })}
          onClick={handleClickOutside}
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
                />
                <button type='submit'>
                  <SearchIcon width={31} height={31} className={cn('icon', { black: isBlack })} />
                </button>
              </form>
              {isFocus && (
                <div
                  className={cn('suggest-wrapper', { 'bg-black': isBlack })}
                  onClick={handleSugestionClick}
                  ref={suggestRef}
                >
                  {searchKeyword ? <div>검색어 제안</div> : <div>최근 검색어</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
