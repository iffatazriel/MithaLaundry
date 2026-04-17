'use client';

import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryStats from '@/components/inventory/InventoryStats';
import SuppliesTable from '@/components/inventory/SuppliesTable';
import AutoRestockBanner from '@/components/inventory/AutoRestockBanner';

export default function InventoryPage() {
  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <InventoryHeader />
      <InventoryStats />
      <SuppliesTable />
      <AutoRestockBanner />
    </main>
  );
}