'use client';
 
import { useState } from 'react';
import { Customer } from '@/lib/types/customers';
import { useCustomers } from '@/lib/hooks/useCustomers';
import CustomersHeader from '@/components/customers/CustomersHeader';
import CustomerOverviewStats from '@/components/customers/CustomerOverviewStats';
import CustomerSearch from '@/components/customers/CustomerSearch';
import CustomerTable from '@/components/customers/CustomerTable';
import AddCustomerModal from '@/components/customers/AddCustomerModal';

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    customers,
    filteredCustomers,
    stats,
    filters,
    updateFilters,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    addCustomer
  } = useCustomers();
 
  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-8">
      <CustomersHeader onAddClick={() => setIsModalOpen(true)} />
      <CustomerOverviewStats stats={stats} />
      <CustomerSearch filters={filters} onFilterChange={updateFilters} />
      <CustomerTable
        customers={customers}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCustomers={filteredCustomers.length}
        onPageChange={setCurrentPage}
      />
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerCreated={(customer: Customer) => {
          addCustomer(customer);
          setIsModalOpen(false);
        }}
      />
    </main>
  );
}
