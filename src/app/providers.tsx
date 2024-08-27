'use client';

import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import classNames from 'classnames/bind';
import { ReactNode, useRef } from 'react';

import { ScrollUpButton } from '@/components';
import { ToastContainer, Zoom } from 'react-toastify';
import AOSWrapper from './_components/Aos/AOSWrapper';
import AdvertisePanel from './event/_components/AdvertisePanel';

import '@/styles/toast/toastContainer.scss';
import 'react-toastify/ReactToastify.min.css';
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
      <div id='modal' />
      <div className={cn('floating-area')}>
        <AdvertisePanel />
        <ScrollUpButton headerRef={scrollRef} />
      </div>
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
      <AOSWrapper />
    </QueryClientProvider>
  );
}
