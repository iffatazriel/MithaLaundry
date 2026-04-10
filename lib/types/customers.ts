'use client';
 
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  avatarColor: string;
  totalOrders: number;
  status: 'member' | 'guest';
  joinDate: string;
  totalSpent?: number;
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
  error?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}