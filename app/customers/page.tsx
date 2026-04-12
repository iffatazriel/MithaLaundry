'use client';
 
import { useState } from 'react';
import { Customer } from '@/lib/types/customers';
import { useCustomers } from '@/lib/hooks/useCustomers';
import CustomersHeader from '@/components/customers/CustomersHeader';
import CustomerStats from '@/components/customers/CustomerStats';
import CustomerSearch from '@/components/customers/CustomerSearch';
import CustomerTable from '@/components/customers/CustomerTable';
import AddCustomerModal from '@/components/customers/AddCustomerModal';

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    customers,
    stats,
    filters,
    updateFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    addCustomer
  } = useCustomers();
 
  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <CustomersHeader onAddClick={() => setIsModalOpen(true)} />
      <CustomerStats stats={stats} />
      <CustomerSearch filters={filters} onFilterChange={updateFilters} />
      <CustomerTable
        customers={customers}
        loading={false}
        currentPage={currentPage}
        totalPages={totalPages}
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