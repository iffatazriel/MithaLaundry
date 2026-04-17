'use client';

import { Package, AlertTriangle, Wallet, Clock } from 'lucide-react';
import { inventoryStats } from '@/lib/data/inventoryData';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const stats = [
  {
    label: 'Total Items',
    value: inventoryStats.totalItems.toString(),
    badge: inventoryStats.totalItemsChange,
    badgeColor: 'text-green-600 bg-green-50',
    icon: Package,
    iconColor: 'text-blue-500 bg-blue-50',
    valueColor: 'text-blue-600',
  },
  {
    label: 'Low Stock Alerts',
    value: inventoryStats.lowStockAlerts.toString().padStart(2, '0'),
    badge: 'items',
    badgeColor: 'text-orange-600 bg-orange-50',
    icon: AlertTriangle,
    iconColor: 'text-orange-500 bg-orange-50',
    valueColor: 'text-orange-500',
  },
  {
    label: 'Monthly Spend',
    value: formatRupiah(inventoryStats.monthlySpend),
    badge: null,
    badgeColor: '',
    icon: Wallet,
    iconColor: 'text-blue-500 bg-blue-50',
    valueColor: 'text-gray-800',
  },
  {
    label: 'Last Restock',
    value: inventoryStats.lastRestock,
    badge: null,
    badgeColor: '',
    icon: Clock,
    iconColor: 'text-gray-500 bg-gray-100',
    valueColor: 'text-gray-800',
  },
];

export default function InventoryStats() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, badge, badgeColor, icon: Icon, iconColor, valueColor }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {label}
            </p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
              <Icon size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${valueColor}`}>{value}</span>
            {badge && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}