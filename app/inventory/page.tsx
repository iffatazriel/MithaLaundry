'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  WashingMachine,
  X,
} from 'lucide-react'
import { unwrapApiArray } from '@/lib/api-client'

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  maxStock: number
  price: number
  supplier?: string
  description?: string
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'detergent', label: 'Chemicals' },
  { value: 'fabric_softener', label: 'Chemicals' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'other', label: 'Essentials' },
] as const

const EMPTY_FORM = {
  name: '',
  category: 'detergent',
  quantity: 0,
  unit: 'kg',
  minStock: 5,
  maxStock: 100,
  price: 0,
  supplier: '',
  description: '',
}

function formatCurrency(value: number) {
  return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}M`
  }

  return formatCurrency(value)
}

function formatCategory(value: string) {
  return CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value
}

function stockPercent(item: InventoryItem) {
  if (item.maxStock <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round((item.quantity / item.maxStock) * 100)))
}

function itemIconTone(category: string) {
  if (category === 'detergent' || category === 'fabric_softener') {
    return 'bg-blue-50 text-[#00488d]'
  }

  return 'bg-slate-50 text-slate-600'
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [formData, setFormData] = useState(EMPTY_FORM)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/inventory', { cache: 'no-store' })
      const payload = await res.json()
      setItems(res.ok ? unwrapApiArray<InventoryItem>(payload) : [])
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchItems()
  }, [])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData(EMPTY_FORM)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        await fetchItems()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus item ini?')) return

    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (data.success) {
        await fetchItems()
      }
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
      maxStock: item.maxStock,
      price: item.price,
      supplier: item.supplier || '',
      description: item.description || '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.supplier ?? '').toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [categoryFilter, items, search])

  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const lastRestockLabel = items.length > 0 ? 'Today' : '-'

  return (
    <main className="min-h-full min-w-0 bg-[#f7f9fb] px-4 pb-10 pt-6 text-[#191c1e] sm:px-6 lg:px-8">
      <div className="mx-auto min-w-0 max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.22em] text-[#00488d]">
              Stock Overview
            </p>
            <h1 className="text-4xl font-black tracking-tight text-[#191c1e]">
              Supplies Control
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm((current) => !current)
              setEditingId(null)
              if (showForm) setFormData(EMPTY_FORM)
            }}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-br from-[#00488d] to-[#005fb8] px-8 py-3 text-sm font-bold text-white shadow-xl transition active:scale-95"
          >
            {showForm ? <X size={18} /> : <PlusCircle size={18} />}
            {showForm ? 'Close Form' : 'Restock Supplies'}
          </button>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200/70 bg-white p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Items
            </span>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-[#00488d]">{items.length}</span>
              <span className="mb-1 text-xs font-bold text-green-600">Active</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Low Stock Alerts
            </span>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-[#7b3200]">
                {String(lowStockItems.length).padStart(2, '0')}
              </span>
              <span className="mb-1 text-xs font-medium text-slate-400">Items</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stock Value
            </span>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-[#00488d]">
                {formatCompactCurrency(totalValue)}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Last Restock
            </span>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xl font-extrabold text-[#191c1e]">{lastRestockLabel}</span>
            </div>
          </div>
        </div>

        {showForm ? (
          <section className="mb-10 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-[#191c1e]">
                {editingId ? 'Edit Supply Item' : 'Add Supply Item'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update stok, supplier, dan nilai persediaan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <input
                type="text"
                placeholder="Supply item"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
              >
                {CATEGORY_OPTIONS.filter((option) => option.value !== 'all').map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) || 0 })
                }
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="text"
                placeholder="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) || 0 })
                }
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="text"
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
              />
              <div className="flex gap-3 md:col-span-2 xl:col-span-3">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-br from-[#00488d] to-[#005fb8] px-5 py-3 text-sm font-bold text-white transition active:scale-95"
                >
                  {editingId ? 'Update Supply' : 'Save Supply'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search supplies..."
              className="h-11 w-full rounded-full border-0 bg-[#e6e8ea] pl-11 pr-4 text-sm text-[#191c1e] outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#a8c8ff]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-11 rounded-full border-0 bg-[#e6e8ea] px-4 text-sm font-semibold text-slate-600 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#a8c8ff]"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <section className="rounded-2xl border border-slate-200/60 bg-white p-2 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-6 py-5">Supply Item</th>
                  <th className="px-6 py-5 text-center">Category</th>
                  <th className="px-6 py-5 text-center">In Stock</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef0]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                      Loading supplies...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                      No supplies found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLowStock = item.quantity <= item.minStock
                    const percent = stockPercent(item)

                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors duration-200 hover:bg-[#f2f4f6]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl ${itemIconTone(
                                item.category
                              )}`}
                            >
                              <WashingMachine size={24} />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-extrabold text-[#191c1e]">
                                {item.name}
                              </div>
                              <div className="truncate text-xs text-slate-500">
                                {item.description || item.supplier || 'Supply item'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="rounded-full bg-[#d0e6f3] px-3 py-1 text-xs font-semibold text-[#536772]">
                            {formatCategory(item.category)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div
                            className={`font-extrabold ${
                              isLowStock ? 'text-[#7b3200]' : 'text-[#191c1e]'
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </div>
                          <div className="mx-auto mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                isLowStock ? 'bg-[#7b3200]' : 'bg-[#00488d]'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`rounded-lg border px-3 py-1 text-xs font-bold ${
                              isLowStock
                                ? 'border-[#7b3200]/10 bg-[#ffdbcb]/70 text-[#7b3200]'
                                : 'border-green-100 bg-green-50 text-green-700'
                            }`}
                          >
                            {isLowStock ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            {isLowStock ? (
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="rounded-lg px-2 py-2 text-xs font-bold text-[#00488d] transition hover:bg-blue-50"
                              >
                                Restock Now
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#00488d]"
                              aria-label={`Edit ${item.name}`}
                            >
                              <Edit2 size={17} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-xs text-slate-500">
              Showing {filteredItems.length} of {items.length} items
            </span>
            <div className="flex gap-2">
              <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50">
                <ChevronLeft size={18} />
              </button>
              <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-[#00488d] p-8 shadow-2xl">
            <div className="relative z-10">
              <h2 className="mb-4 text-2xl font-black text-white">Auto-Restock is Active</h2>
              <p className="mb-6 max-w-sm text-sm leading-6 text-blue-100">
                Sistem membantu menandai stok kritis agar operator bisa restock sebelum
                operasional harian tersendat.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#00488d] shadow-lg transition active:scale-95"
              >
                Manage Rules
              </button>
            </div>
            <Sparkles className="absolute -bottom-10 -right-8 h-44 w-44 text-white/20" />
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#2d3133]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d6e3ff] via-[#f2f4f6] to-[#e0e3e5]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="h-32 w-32 text-[#00488d]/20" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-8">
              <p className="max-w-md text-sm font-medium italic text-white">
                &ldquo;An organized inventory is the backbone of a pristine service.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
