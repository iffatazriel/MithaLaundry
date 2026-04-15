'use client';
 
// Hook ini sekarang hanya menjadi thin wrapper dari CustomerContext.
// Semua komponen yang sudah pakai useCustomers() tidak perlu diubah sama sekali.
 
import { useCustomerContext } from '@/lib/context/CustomerContext';
 
export function useCustomers() {
  return useCustomerContext();
}
 