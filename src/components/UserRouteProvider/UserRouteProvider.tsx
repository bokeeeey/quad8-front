'use client';

import { ROUTER } from '@/constants/route';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface UserRouteProviderProps {
  children: ReactNode;
}

export default function UserRouteProvider({ children }: UserRouteProviderProps) {
  const router = useRouter();
  const { data: userData } = useUser();
  useEffect(() => {
    if (!userData?.data) {
      router.push(ROUTER.MAIN);
    }
  }, [router, userData]);
  return children;
}
