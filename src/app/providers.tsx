'use client';

import { ReactNode, useRef } from 'react';
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import classNames from 'classnames/bind';

import { ToastContainer, Zoom } from 'react-toastify';
import { ScrollUpButton } from '@/components';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toast/toastContainer.scss';
import styles from './providers.module.scss';

const cn = classNames.bind(styles);

interface ProvidersProps {
  children: ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();
  const scrollRef = useRef(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div ref={scrollRef} className={cn('target')} />
      {children}
      <ScrollUpButton headerRef={scrollRef} />
      <div id='modal' />
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer
        autoClose={2000}
        theme='dark'
        position='top-center'
        transition={Zoom}
        limit={2}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        closeOnClick
        hideProgressBar
        closeButton={false}
      />
    </QueryClientProvider>
  );
}
