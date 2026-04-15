'use client';
 
export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  status: string;
  totalOrders: number;
  avatar?: string;
  avatarColor?: string;
}
 
export interface CustomerStats {
  totalCustomers: number;
  totalCustomersGrowth: number;
  activeMembers: number;
  guestCount: number;
}
 
export interface CustomerFilters {
  search: string;
  status?: 'member' | 'guest' | 'all';
  sortBy?: 'name' | 'orders' | 'date';
}
 


export interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
  onPageChange: (page: number) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}