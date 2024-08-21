'use client';

import { ROUTER } from '@/constants/route';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/*
usePreventNavigation훅은 페이지를 떠나는 것을 방지하고, 페이지 뒤로 가기 이벤트(popstate)가 발생했을 때 특정 페이지로 리다이렉션 하는것으로 동작합니다
*/

export const usePreventNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handlePopState = () => {
      router.replace(ROUTER.MY_PAGE.CHECKOUT_FAIL);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);
};
