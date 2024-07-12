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

  /* 
    헤더 검색버튼 눌렀을 때 함수
    검색 컴포넌트 열 때는 isRender도 같이 true로 바로 바뀌도록 설정/ 닫혔을 때는 비활성
    => 애니메이션이 끝난 후에 isRender 값이 false로 바뀌도록 하기 위해
  */
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
  const handleClickOutside = (e: SyntheticEvent<HTMLDivElement>) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      handleClickButton();
    }
  };

  /* 페이지 이동 시 검색 컴포넌트 안 보이도록 변경 */
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
              <SearchBox isBlack={isBlack} onSubmit={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
