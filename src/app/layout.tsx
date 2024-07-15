import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import classNames from 'classnames/bind';

import { getUserData } from '@/api/usersAPI';
import { getCartData } from '@/api/cartAPI';
import { Footer, Header } from '@/components';
import { Providers } from './providers';

import '@/styles/reset.css';
import styles from './layout.module.scss';

const cn = classNames.bind(styles);

export const metadata: Metadata = {
  title: '키보드 득템 :: KeyDeuk',
  description: '원하는 컬러, 소리, 타건감, 내 취향을 담은 커스텀 키보드 초보도 쉽게 만들 수 있어요',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const queryClient = new QueryClient();
  const entireQueryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  await entireQueryClient.prefetchQuery({ queryKey: ['cartData'], queryFn: getCartData });

  return (
    <html lang='ko'>
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(entireQueryClient)}>
            <div className={cn('wrapper')}>
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Header />
              </HydrationBoundary>
              <div className={cn('content-wrapper')}>{children}</div>
              <Footer />
            </div>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
