'use client';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import { SearchIcon } from '@/public/index';
import SearchBox from '@/components/SearchBox/SearchBox';

import styles from './SearchButton.module.scss';

const cn = classNames.bind(styles);

interface SearchBoxProps {
  isBlack: boolean;
}

export default function SearchButton({ isBlack }: SearchBoxProps) {
  const pathName = usePathname();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);

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

  const handleClickOutside = (e: SyntheticEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      handleClickButton();
    }
  };

  const handleSubmitSearch = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsRender(false);
  }, [pathName]);

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
            <div className={cn('search-box-wrapper')}>
              <SearchBox isBlack={isBlack} onSubmit={handleSubmitSearch} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
