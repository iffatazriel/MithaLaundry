'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, RotateCcw, Pencil, Trash2 } from 'lucide-react';
import { supplyItems, SupplyItem, StockStatus, SupplyCategory } from '@/lib/data/inventoryData';

const PAGE_SIZE = 4;

const categoryColorMap: Record<SupplyCategory, string> = {
  Chemicals: 'bg-blue-50 text-blue-600 border-blue-100',
  Packaging: 'bg-purple-50 text-purple-600 border-purple-100',
  Essentials: 'bg-teal-50 text-teal-600 border-teal-100',
  Equipment: 'bg-amber-50 text-amber-600 border-amber-100',
};

const statusColorMap: Record<StockStatus, string> = {
  'In Stock': 'bg-green-50 text-green-600 border-green-100',
  'Low Stock': 'bg-orange-50 text-orange-500 border-orange-100',
  'Out of Stock': 'bg-red-50 text-red-500 border-red-100',
};

function StockBar({ quantity, min, max, status }: { quantity: number; min: number; max: number; status: StockStatus }) {
  const pct = Math.min(100, Math.round((quantity / max) * 100));
  const barColor =
    status === 'In Stock' ? 'bg-blue-500' :
    status === 'Low Stock' ? 'bg-orange-400' :
    'bg-red-400';

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-gray-800">
        {quantity} {/* unit shown in parent */}
      </span>
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: SupplyCategory }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${categoryColorMap[category]}`}>
      {category}
    </span>
  );
}

function StatusBadge({ status }: { status: StockStatus }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColorMap[status]}`}>
      {status}
    </span>
  );
}

function SupplyIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes('detergent') || n.includes('softener') || n.includes('stain') || n.includes('cleaner')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    );
  }
  if (n.includes('bag') || n.includes('cover') || n.includes('tag') || n.includes('label')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    );
  }
  if (n.includes('hanger')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.38 18H3.62a1 1 0 01-.7-1.71L12 8l9.08 8.29A1 1 0 0120.38 18z" />
        <path d="M12 8V5a2 2 0 000-4" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

function ActionMenu({ item, onRestock, onEdit, onDelete }: {
  item: SupplyItem;
  onRestock: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden">
            <button
              onClick={() => { onRestock(item.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition"
            >
              <RotateCcw size={13} /> Restock
            </button>
            <button
              onClick={() => { onEdit(item.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Pencil size={13} /> Edit Item
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={() => { onDelete(item.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SuppliesTable() {
  const [items, setItems] = useState<SupplyItem[]>(supplyItems);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRestock = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.maxStock, status: 'In Stock' }
          : item
      )
    );
  };

  const handleEdit = (id: number) => {
    // TODO: open edit modal
    console.log('Edit item:', id);
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (page > Math.ceil((items.length - 1) / PAGE_SIZE)) {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
        {['Supply Item', 'Category', 'In Stock', 'Status', 'Actions'].map((col) => (
          <p key={col} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {col}
          </p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {paginated.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition"
          >
            {/* Supply Item */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                <SupplyIcon name={item.name} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            {/* Category */}
            <div>
              <CategoryBadge category={item.category} />
            </div>

            {/* In Stock */}
            <div>
              <StockBar
                quantity={item.quantity}
                min={item.minStock}
                max={item.maxStock}
                status={item.status}
              />
              <span className="text-xs text-gray-400">{item.unit}</span>
            </div>

            {/* Status */}
            <div>
              <StatusBadge status={item.status} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {item.status !== 'In Stock' && (
                <button
                  onClick={() => handleRestock(item.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Restock Now
                </button>
              )}
              <ActionMenu
                item={item}
                onRestock={handleRestock}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/40">
        <p className="text-xs text-gray-400">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, items.length)} of {items.length} items
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}