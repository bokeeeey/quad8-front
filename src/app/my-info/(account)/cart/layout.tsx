import { ReactNode } from 'react';
import { CartDataContextProvider } from '@/context/CartDataContext';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return <CartDataContextProvider>{children}</CartDataContextProvider>;
}
