import { OrderProvider } from '@/lib/context/OrderContext';
import { ReactNode } from 'react';

export default function OrderLayout({ children }: { children: ReactNode }) {
  return (
    <OrderProvider>
      {children}
    </OrderProvider>
  );
}