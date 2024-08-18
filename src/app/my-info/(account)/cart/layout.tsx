import { CartDataContextProvider } from '@/context/CartDataContext';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return <CartDataContextProvider>{children}</CartDataContextProvider>;
}
