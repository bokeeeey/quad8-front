'use client';

import classNames from 'classnames/bind';
import { MouseEvent, useRef, useState } from 'react';
import { SearchIcon } from '@/public/index';
import styles from './SearchBox.module.scss';

const cn = classNames.bind(styles);

interface SearchBoxProps {
  isBlack: boolean;
}

export default function SearchBox({ isBlack }: SearchBoxProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);
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

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      handleClickButton();
    }
  };

  return (
    <div>
      <SearchIcon width={31} height={31} className={cn('icon', { black: isBlack })} onClick={handleClickButton} />
      {isRender && (
        <div className={cn('search-wrapper', { 'fade-out': !isOpen })} onClick={handleClickOutside}>
          <div className={cn('content-wrapper', { 'slide-out': !isOpen })} ref={wrapperRef}>
            <form>
              <input />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
