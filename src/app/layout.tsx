import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { getUserData } from '@/api/profileAPI';
import { Header } from '@/components';
import { Providers } from './providers';

import '@/styles/reset.css';

export const metadata: Metadata = {
  title: '키보드 득템 :: KeyDuek',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const queryClient = new QueryClient();

  const token = cookies().get('accessToken')?.value || null;

  if (token) {
    await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: () => getUserData(token) });
  }

  // await queryClient.prefetchQuery({
  //   queryKey: ['userData'],
  //   queryFn: () =>
  //     getUserData(
  //       `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MDAzQGdtYWlsLmNvbSIsImlhdCI6MTcxODI3OTQ2NiwiZXhwIjoxNzE4MjgzMDY2LCJ1c2VybmFtZSI6InRlc3QwMDNAZ21haWwuY29tIn0.W55sHhL_C4TxFAyBWAkL5JQYYhz6-aRNup8KIWVGKeM`,
  //     ),
  // });

  return (
    <html lang='ko'>
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Header />
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
