'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Box,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';

type InventoryStatus = 'healthy' | 'low' | 'incoming';

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minimumStock: number;
  lastUpdated: string;
  supplier: string;
  monthlyUsage: number;
  status: InventoryStatus;
};

const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: 'Detergen Cair Premium',
    category: 'Bahan Cuci',
    unit: 'Liter',
    stock: 28,
    minimumStock: 12,
    lastUpdated: 'Hari ini, 08:30',
    supplier: 'PT Bersih Makmur',
    monthlyUsage: 64,
    status: 'healthy',
  },
  {
    id: 2,
    name: 'Pewangi Laundry Ocean',
    category: 'Pewangi',
    unit: 'Liter',
    stock: 9,
    minimumStock: 15,
    lastUpdated: 'Hari ini, 09:10',
    supplier: 'Aroma Nusantara',
    monthlyUsage: 51,
    status: 'low',
  },
  {
    id: 3,
    name: 'Plastik Packing Besar',
    category: 'Packaging',
    unit: 'Pack',
    stock: 16,
    minimumStock: 10,
    lastUpdated: 'Kemarin, 17:20',
    supplier: 'Mitra Kemas',
    monthlyUsage: 24,
    status: 'healthy',
  },
  {
    id: 4,
    name: 'Hanger Kawat',
    category: 'Operasional',
    unit: 'Pack',
    stock: 6,
    minimumStock: 8,
    lastUpdated: 'Kemarin, 15:45',
    supplier: 'Sentra Laundry Supply',
    monthlyUsage: 12,
    status: 'low',
  },
  {
    id: 5,
    name: 'Oxygen Bleach',
    category: 'Bahan Cuci',
    unit: 'Kg',
    stock: 14,
    minimumStock: 10,
    lastUpdated: '2 hari lalu',
    supplier: 'PT Bersih Makmur',
    monthlyUsage: 18,
    status: 'incoming',
  },
  {
    id: 6,
    name: 'Tali Tagging',
    category: 'Operasional',
    unit: 'Roll',
    stock: 19,
    minimumStock: 7,
    lastUpdated: 'Hari ini, 07:55',
    supplier: 'Sentra Laundry Supply',
    monthlyUsage: 9,
    status: 'healthy',
  },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'Semua Item' },
  { id: 'low', label: 'Perlu Restock' },
  { id: 'incoming', label: 'Dalam Pengiriman' },
];

const STATUS_STYLES: Record<InventoryStatus, string> = {
  healthy: 'bg-emerald-50 text-emerald-700',
  low: 'bg-amber-50 text-amber-700',
  incoming: 'bg-blue-50 text-blue-700',
};

const STATUS_LABELS: Record<InventoryStatus, string> = {
  healthy: 'Aman',
  low: 'Menipis',
  incoming: 'Incoming',
};

export default function InventoryPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | InventoryStatus>('all');

  const filteredItems = INVENTORY_ITEMS.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.supplier.toLowerCase().includes(normalizedQuery);

    return matchesFilter && matchesQuery;
  });

  const totalProducts = INVENTORY_ITEMS.length;
  const lowStockCount = INVENTORY_ITEMS.filter((item) => item.status === 'low').length;
  const incomingCount = INVENTORY_ITEMS.filter((item) => item.status === 'incoming').length;
  const healthyCount = INVENTORY_ITEMS.filter((item) => item.status === 'healthy').length;

  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600">Operations / Inventory</p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Inventory Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Pantau stok bahan laundry, kebutuhan restock, dan item operasional dalam satu
            tampilan yang rapi.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
          <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-100">
            <Truck size={18} />
            Cek Pengiriman
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            <ShoppingBag size={18} />
            Buat Restock
          </button>
        </div>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Box size={20} />
            </div>
            <span className="text-xs font-medium text-gray-400">Aktif</span>
          </div>
          <p className="text-sm text-gray-500">Total Item</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <span className="text-xs font-medium text-amber-600">Prioritas</span>
          </div>
          <p className="text-sm text-gray-500">Perlu Restock</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{lowStockCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Truck size={20} />
            </div>
            <span className="text-xs font-medium text-blue-600">Monitor</span>
          </div>
          <p className="text-sm text-gray-500">Dalam Pengiriman</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{incomingCount}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <PackageCheck size={20} />
            </div>
            <span className="text-xs font-medium text-emerald-600">Stabil</span>
          </div>
          <p className="text-sm text-gray-500">Stok Aman</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{healthyCount}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Daftar Persediaan</h2>
              <p className="mt-1 text-sm text-gray-500">
                Cari berdasarkan nama item, kategori, atau supplier.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[420px] lg:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <Search size={18} className="text-gray-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari inventory..."
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </label>

              <div className="flex gap-2 overflow-x-auto">
                {FILTER_OPTIONS.map((option) => {
                  const isActive = activeFilter === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setActiveFilter(option.id as 'all' | InventoryStatus)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
                <p className="text-base font-semibold text-gray-700">Item tidak ditemukan</p>
                <p className="mt-2 text-sm text-gray-500">
                  Coba ubah kata kunci pencarian atau pilih filter yang berbeda.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const stockRatio = Math.min((item.stock / (item.minimumStock * 2)) * 100, 100);

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-100 p-4 transition hover:border-blue-100 hover:shadow-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[item.status]}`}
                          >
                            {STATUS_LABELS[item.status]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.category} - Supplier {item.supplier}
                        </p>
                      </div>

                      <button className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50">
                        Detail
                        <ArrowUpRight size={16} />
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Stok Saat Ini</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {item.stock} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Minimum</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {item.minimumStock} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Pemakaian/Bulan</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {item.monthlyUsage} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Update Terakhir</p>
                        <p className="mt-1 text-base font-semibold text-gray-800">{item.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Level stok</span>
                        <span className="font-medium text-gray-700">{Math.round(stockRatio)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === 'low'
                              ? 'bg-amber-500'
                              : item.status === 'incoming'
                                ? 'bg-blue-500'
                                : 'bg-emerald-500'
                          }`}
                          style={{ width: `${stockRatio}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Restock Prioritas</h2>
            <p className="mt-1 text-sm text-gray-500">
              Item yang sebaiknya segera dipesan ulang minggu ini.
            </p>

            <div className="mt-5 space-y-4">
              {INVENTORY_ITEMS.filter((item) => item.status === 'low').map((item) => (
                <div key={item.id} className="rounded-2xl bg-amber-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Sisa {item.stock} {item.unit} dari minimum {item.minimumStock} {item.unit}
                      </p>
                    </div>
                    <AlertTriangle size={18} className="mt-1 text-amber-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900">Catatan Operasional</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-900">Jadwal audit stok</p>
                <p className="mt-1 text-sm text-gray-500">Senin, 21 April 2026 • 09:00 WIB</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-900">Supplier paling aktif</p>
                <p className="mt-1 text-sm text-gray-500">PT Bersih Makmur • 2 item rutin per bulan</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-900">Rekomendasi minggu ini</p>
                <p className="mt-1 text-sm text-gray-500">
                  Fokus restock pewangi dan hanger agar order akhir pekan tetap aman.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
