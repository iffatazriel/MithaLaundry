import { CustomerProvider } from '@/lib/context/CustomerContext';
import { ReactNode } from 'react';
 
// Provider hanya aktif di scope /customers — tidak membebani halaman lain
export default function CustomersLayout({ children }: { children: ReactNode }) {
  return (
    <CustomerProvider>
      {children}
    </CustomerProvider>
  );
}
 