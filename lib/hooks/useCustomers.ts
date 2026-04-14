'use client';
 
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Customer, CustomerFilters, CustomerStats } from '@/lib/types/customers';
import { mockCustomers, ITEMS_PER_PAGE } from '@/lib/mockData/customers';
 
export function useCustomers() {
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    status: 'all',
    sortBy: 'name'
  });
 
  const [currentPage, setCurrentPage] = useState(1);

  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
  setLoading(true);
  fetch('/api/customers')
    .then(res => res.json())
    .then(data => setCustomers(data))
    .finally(() => setLoading(false));
}, []);


  const [loading, setLoading] = useState(false);
 
  const filteredCustomers = useMemo(() => {
    let result = [...customers];
 
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.includes(search)
      );
    }
 
    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
 
    if (filters.sortBy === 'orders') {
      result.sort((a, b) => b.totalOrders - a.totalOrders);
    } else if (filters.sortBy === 'date') {
      result.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
 
    return result;
  }, [customers, filters]);
 
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);
 
  const stats: CustomerStats = useMemo(() => ({
    totalCustomers: customers.length,
    totalCustomersGrowth: 12,
    activeMembers: customers.filter(c => c.status === 'member').length,
    guestCount: customers.filter(c => c.status === 'guest').length
  }), [customers]);
 
  const updateFilters = useCallback((newFilters: Partial<CustomerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);
 
  const addCustomer = useCallback((customer: Customer) => {
    setCustomers(prev => [customer, ...prev]);
  }, []);
 
  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  }, []);
 
  return {
    customers: paginatedCustomers,
    filteredCustomers,
    allCustomers: customers,
    stats,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    addCustomer,
    deleteCustomer
  };
}