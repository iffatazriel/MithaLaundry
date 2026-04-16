'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode
} from 'react';
import { Customer, CustomerFilters, CustomerStats } from '@/lib/types/customers';

const ITEMS_PER_PAGE = 10;

// ─── Shape of context ───────────────────────────────────────────────────────

interface CustomerContextValue {
  // Data
  customers: Customer[];           // paginated (untuk ditampilkan di tabel)
  allCustomers: Customer[];        // semua data tanpa filter
  filteredCustomers: Customer[];   // setelah filter, sebelum paginate
  stats: CustomerStats;

  // Filter & Pagination
  filters: CustomerFilters;
  updateFilters: (newFilters: Partial<CustomerFilters>) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;

  // Status
  loading: boolean;
  error: string | null;

  // Actions
  addCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  refreshCustomers: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CustomerContext = createContext<CustomerContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    status: 'all',
    sortBy: 'name'
  });

  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch dari API ──────────────────────────────────────────────────────────
  const refreshCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data: Customer[] = await res.json();
      setAllCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  // ── Filter & Sort ───────────────────────────────────────────────────────────
  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(search) ||
        (c.email ?? '').toLowerCase().includes(search) ||
        c.phone.includes(search)
      );
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }

    if (filters.sortBy === 'orders') {
      result.sort((a, b) => b.totalOrders - a.totalOrders);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [allCustomers, filters]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const customers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats: CustomerStats = useMemo(() => ({
    totalCustomers: allCustomers.length,
    totalCustomersGrowth: 12,
    activeMembers: allCustomers.filter(c => c.status === 'member').length,
    guestCount: allCustomers.filter(c => c.status === 'guest').length
  }), [allCustomers]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const updateFilters = useCallback((newFilters: Partial<CustomerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // reset ke halaman 1 setiap filter berubah
  }, []);

  const addCustomer = useCallback((customer: Customer) => {
    setAllCustomers(prev => [customer, ...prev]);
  }, []);

  const deleteCustomer = useCallback((customerId: string) => {
    setAllCustomers(prev => prev.filter(c => c.id !== customerId));
  }, []);

  const value: CustomerContextValue = {
    customers,
    allCustomers,
    filteredCustomers,
    stats,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    addCustomer,
    deleteCustomer,
    refreshCustomers
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCustomerContext() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
}
