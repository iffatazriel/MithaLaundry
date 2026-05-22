'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  Edit2,
  History,
  Loader2,
  PackageCheck,
  PackagePlus,
  PlusCircle,
  RotateCcw,
  Save,
  Search,
  SlidersHorizontal,
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
  supplier?: string | null
  description?: string | null
  lastRestocked?: string | null
  _count?: {
    movements: number
  }
}

interface InventoryMovement {
  id: string
  itemId: string
  type: MovementType
  quantity: number
  note?: string | null
  createdBy?: string | null
  createdAt: string
  item?: {
    name: string
    unit: string
  }
}

type MovementType = 'in' | 'out' | 'adjustment'
type ActivePanel = 'item' | 'movement' | null

const CATEGORY_OPTIONS = [
  { value: 'detergent', label: 'Detergent' },
  { value: 'fabric_softener', label: 'Pewangi' },
  { value: 'equipment', label: 'Peralatan' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'other', label: 'Lainnya' },
] as const

const FILTER_OPTIONS = [{ value: 'all', label: 'Semua Kategori' }, ...CATEGORY_OPTIONS] as const

const MOVEMENT_OPTIONS: Array<{
  value: MovementType
  label: string
  helper: string
}> = [
  { value: 'in', label: 'Stok Masuk', helper: 'Restock dari supplier' },
  { value: 'out', label: 'Stok Keluar', helper: 'Pemakaian operasional' },
  { value: 'adjustment', label: 'Koreksi Stok', helper: 'Set jumlah stok akhir' },
]

const EMPTY_ITEM_FORM = {
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

const EMPTY_MOVEMENT_FORM = {
  itemId: '',
  type: 'in' as MovementType,
  quantity: 1,
  note: '',
}

const PAGE_SIZE = 8

function formatCurrency(value: number) {
  return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} jt`
  }

  return formatCurrency(value)
}

function formatCategory(value: string) {
  return CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? value
}

function formatDateTime(value?: string | null) {
  if (!value) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function stockPercent(item: InventoryItem) {
  if (item.maxStock <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round((item.quantity / item.maxStock) * 100)))
}

function getStockStatus(item: InventoryItem) {
  if (item.quantity <= item.minStock) {
    return {
      label: 'Low Stock',
      tone: 'border-amber-200 bg-amber-50 text-amber-800',
      bar: 'bg-amber-600',
    }
  }

  if (item.maxStock > 0 && item.quantity >= item.maxStock) {
    return {
      label: 'Overstock',
      tone: 'border-sky-200 bg-sky-50 text-sky-800',
      bar: 'bg-sky-600',
    }
  }

  return {
    label: 'Ready',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    bar: 'bg-emerald-600',
  }
}

function movementLabel(type: MovementType) {
  return MOVEMENT_OPTIONS.find((option) => option.value === type)?.label ?? type
}

function movementIcon(type: MovementType) {
  if (type === 'in') return <ArrowDownToLine size={16} />
  if (type === 'out') return <ArrowUpFromLine size={16} />
  return <RotateCcw size={16} />
}

function movementTone(type: MovementType) {
  if (type === 'in') return 'bg-emerald-50 text-emerald-700'
  if (type === 'out') return 'bg-rose-50 text-rose-700'
  return 'bg-sky-50 text-sky-700'
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object') {
    const record = payload as { error?: unknown; details?: unknown }
    if (Array.isArray(record.details)) {
      return record.details.join(', ')
    }
    if (typeof record.error === 'string') {
      return record.error
    }
  }

  return fallback
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM)
  const [movementForm, setMovementForm] = useState(EMPTY_MOVEMENT_FORM)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/inventory', { cache: 'no-store' })
    const payload = await res.json()

    if (!res.ok) {
      throw new Error(getErrorMessage(payload, 'Gagal mengambil data inventory'))
    }

    setItems(unwrapApiArray<InventoryItem>(payload))
  }, [])

  const fetchMovements = useCallback(async () => {
    const res = await fetch('/api/inventory-movements?limit=8', { cache: 'no-store' })
    const payload = await res.json()

    if (!res.ok) {
      throw new Error(getErrorMessage(payload, 'Gagal mengambil riwayat inventory'))
    }

    setMovements(unwrapApiArray<InventoryMovement>(payload))
  }, [])

  const refreshInventory = useCallback(async () => {
    try {
      setLoading(true)
      await Promise.all([fetchItems(), fetchMovements()])
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal memuat inventory',
      })
    } finally {
      setLoading(false)
    }
  }, [fetchItems, fetchMovements])

  useEffect(() => {
    void refreshInventory()
  }, [refreshInventory])

  useEffect(() => {
    setPage(1)
  }, [categoryFilter, search])

  const resetItemForm = () => {
    setActivePanel(null)
    setEditingId(null)
    setItemForm(EMPTY_ITEM_FORM)
  }

  const resetMovementForm = () => {
    setActivePanel(null)
    setMovementForm(EMPTY_MOVEMENT_FORM)
  }

  const openNewItemForm = () => {
    setNotice(null)
    setEditingId(null)
    setItemForm(EMPTY_ITEM_FORM)
    setActivePanel('item')
  }

  const openMovementForm = (item?: InventoryItem, type: MovementType = 'in') => {
    setNotice(null)
    setEditingId(null)
    setMovementForm({
      itemId: item?.id ?? '',
      type,
      quantity: type === 'adjustment' ? item?.quantity ?? 0 : 1,
      note: '',
    })
    setActivePanel('movement')
  }

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemForm),
      })

      const payload = await res.json()

      if (!res.ok || !payload.success) {
        throw new Error(getErrorMessage(payload, 'Gagal menyimpan item inventory'))
      }

      await refreshInventory()
      resetItemForm()
      setNotice({
        type: 'success',
        message: editingId ? 'Item inventory berhasil diperbarui.' : 'Item inventory baru tersimpan.',
      })
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menyimpan item inventory',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const res = await fetch('/api/inventory-movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movementForm),
      })

      const payload = await res.json()

      if (!res.ok || !payload.success) {
        throw new Error(getErrorMessage(payload, 'Gagal mencatat pergerakan stok'))
      }

      await refreshInventory()
      resetMovementForm()
      setNotice({ type: 'success', message: 'Pergerakan stok berhasil dicatat.' })
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal mencatat pergerakan stok',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus item ini? Riwayat pergerakannya ikut terhapus.')) return

    setNotice(null)

    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      const payload = await res.json()

      if (!res.ok || !payload.success) {
        throw new Error(getErrorMessage(payload, 'Gagal menghapus item inventory'))
      }

      await refreshInventory()
      setNotice({ type: 'success', message: 'Item inventory berhasil dihapus.' })
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menghapus item inventory',
      })
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setNotice(null)
    setItemForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStock: item.minStock,
      maxStock: item.maxStock,
      price: item.price,
      supplier: item.supplier ?? '',
      description: item.description ?? '',
    })
    setEditingId(item.id)
    setActivePanel('item')
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        formatCategory(item.category).toLowerCase().includes(query) ||
        (item.supplier ?? '').toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [categoryFilter, items, search])

  const lowStockItems = items.filter((item) => item.quantity <= item.minStock)
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const totalMovements = items.reduce((sum, item) => sum + (item._count?.movements ?? 0), 0)
  const lastRestock = items
    .map((item) => item.lastRestocked)
    .filter(Boolean)
    .sort((a, b) => new Date(b as string).getTime() - new Date(a as string).getTime())[0]
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pagedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="min-h-full min-w-0 bg-[#f7f9fb] px-4 pb-10 pt-6 text-[#191c1e] sm:px-6 lg:px-8">
      <div className="mx-auto min-w-0 max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-[#00488d]">
              Inventory
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[#191c1e] sm:text-4xl">
              Kontrol Persediaan
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Pantau bahan, catat stok masuk keluar, dan jaga operasional laundry tetap lancar.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => openMovementForm()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#00488d] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#005fb8] active:scale-95"
            >
              <ArrowDownToLine size={17} />
              Catat Stok
            </button>
            <button
              type="button"
              onClick={openNewItemForm}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <PlusCircle size={17} />
              Tambah Item
            </button>
          </div>
        </div>

        {notice ? (
          <div
            className={`mb-5 rounded-lg border px-4 py-3 text-sm font-semibold ${
              notice.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {notice.message}
          </div>
        ) : null}

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200/70 bg-white p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Item
            </span>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-[#00488d]">{items.length}</span>
              <span className="mb-1 text-xs font-bold text-emerald-600">Aktif</span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200/70 bg-white p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stok Kritis
            </span>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-amber-700">
                {String(lowStockItems.length).padStart(2, '0')}
              </span>
              <span className="mb-1 text-xs font-medium text-slate-400">Item</span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200/70 bg-white p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nilai Stok
            </span>
            <div className="mt-2 text-3xl font-extrabold text-[#00488d]">
              {formatCompactCurrency(totalValue)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200/70 bg-white p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Update Terakhir
            </span>
            <div className="mt-3 text-xl font-extrabold text-[#191c1e]">
              {formatDateTime(lastRestock)}
            </div>
          </div>
        </div>

        {activePanel === 'item' ? (
          <section className="mb-8 rounded-lg border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#191c1e]">
                  {editingId ? 'Edit Item Persediaan' : 'Tambah Item Persediaan'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Atur identitas item, batas stok, supplier, dan harga modal per satuan.
                </p>
              </div>
              <button
                type="button"
                onClick={resetItemForm}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup form item"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input
                type="text"
                placeholder="Nama item"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff] xl:col-span-2"
                required
              />
              <select
                value={itemForm.category}
                onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Satuan, contoh kg/liter/pcs"
                value={itemForm.unit}
                onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="number"
                min={0}
                placeholder="Stok awal"
                value={itemForm.quantity}
                onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) || 0 })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="number"
                min={0}
                placeholder="Minimum stok"
                value={itemForm.minStock}
                onChange={(e) => setItemForm({ ...itemForm, minStock: Number(e.target.value) || 0 })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="number"
                min={1}
                placeholder="Maksimum stok"
                value={itemForm.maxStock}
                onChange={(e) => setItemForm({ ...itemForm, maxStock: Number(e.target.value) || 1 })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="number"
                min={0}
                placeholder="Harga per satuan"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) || 0 })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <input
                type="text"
                placeholder="Supplier"
                value={itemForm.supplier}
                onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff] md:col-span-2"
              />
              <textarea
                placeholder="Catatan/deskripsi item"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                className="min-h-24 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff] xl:col-span-2"
              />
              <div className="flex gap-3 md:col-span-2 xl:col-span-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00488d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#005fb8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
                  {editingId ? 'Update Item' : 'Simpan Item'}
                </button>
                <button
                  type="button"
                  onClick={resetItemForm}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {activePanel === 'movement' ? (
          <section className="mb-8 rounded-lg border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#191c1e]">Catat Pergerakan Stok</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Gunakan form ini untuk restock, pemakaian, atau koreksi stok akhir.
                </p>
              </div>
              <button
                type="button"
                onClick={resetMovementForm}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Tutup form stok"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleMovementSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <select
                value={movementForm.itemId}
                onChange={(e) => setMovementForm({ ...movementForm, itemId: e.target.value })}
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff] xl:col-span-2"
                required
              >
                <option value="">Pilih item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.quantity} {item.unit}
                  </option>
                ))}
              </select>
              <select
                value={movementForm.type}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, type: e.target.value as MovementType })
                }
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
              >
                {MOVEMENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                placeholder={movementForm.type === 'adjustment' ? 'Stok akhir' : 'Jumlah'}
                value={movementForm.quantity}
                onChange={(e) =>
                  setMovementForm({ ...movementForm, quantity: Number(e.target.value) || 0 })
                }
                className="h-11 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff]"
                required
              />
              <textarea
                placeholder="Catatan, contoh restock supplier / dipakai produksi"
                value={movementForm.note}
                onChange={(e) => setMovementForm({ ...movementForm, note: e.target.value })}
                className="min-h-24 rounded-lg border-slate-200 bg-slate-50 text-sm focus:border-[#005fb8] focus:ring-[#d6e3ff] md:col-span-2 xl:col-span-4"
              />
              <div className="flex gap-3 md:col-span-2 xl:col-span-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00488d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#005fb8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader2 className="animate-spin" size={17} /> : <PackageCheck size={17} />}
                  Simpan Pergerakan
                </button>
                <button
                  type="button"
                  onClick={resetMovementForm}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 rounded-lg border border-slate-200/60 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#191c1e]">Daftar Persediaan</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredItems.length} item cocok dari {items.length} total item.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-72">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari item/supplier..."
                    className="h-11 w-full rounded-lg border-0 bg-[#e6e8ea] pl-11 pr-4 text-sm text-[#191c1e] outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#a8c8ff]"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-11 rounded-lg border-0 bg-[#e6e8ea] px-4 text-sm font-semibold text-slate-600 outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-[#a8c8ff]"
                >
                  {FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    <th className="px-4 py-4">Item</th>
                    <th className="px-4 py-4">Kategori</th>
                    <th className="px-4 py-4 text-center">Stok</th>
                    <th className="px-4 py-4 text-center">Nilai</th>
                    <th className="px-4 py-4 text-center">Status</th>
                    <th className="px-4 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceef0]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                        Memuat persediaan...
                      </td>
                    </tr>
                  ) : pagedItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                        Tidak ada item yang cocok.
                      </td>
                    </tr>
                  ) : (
                    pagedItems.map((item) => {
                      const status = getStockStatus(item)
                      const percent = stockPercent(item)

                      return (
                        <tr key={item.id} className="transition-colors hover:bg-[#f2f4f6]">
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#00488d]">
                                <WashingMachine size={22} />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-extrabold text-[#191c1e]">
                                  {item.name}
                                </div>
                                <div className="truncate text-xs text-slate-500">
                                  {item.supplier || item.description || 'Belum ada supplier'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <span className="rounded-full bg-[#d0e6f3] px-3 py-1 text-xs font-semibold text-[#536772]">
                              {formatCategory(item.category)}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <div className="font-extrabold text-[#191c1e]">
                              {item.quantity} {item.unit}
                            </div>
                            <div className="mx-auto mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${status.bar}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="mt-1 text-[11px] text-slate-400">
                              min {item.minStock} / max {item.maxStock}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <div className="text-sm font-bold text-slate-700">
                              {formatCurrency(item.quantity * item.price)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {formatCurrency(item.price)} / {item.unit}
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${status.tone}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              {item.quantity <= item.minStock ? (
                                <button
                                  type="button"
                                  onClick={() => openMovementForm(item, 'in')}
                                  className="rounded-lg px-2 py-2 text-xs font-bold text-[#00488d] transition hover:bg-blue-50"
                                >
                                  Restock
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => openMovementForm(item, 'out')}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                aria-label={`Catat stok keluar ${item.name}`}
                              >
                                <ArrowUpFromLine size={17} />
                              </button>
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
                                aria-label={`Hapus ${item.name}`}
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

            <div className="flex items-center justify-between px-2 py-4">
              <span className="text-xs text-slate-500">
                Halaman {currentPage} dari {pageCount}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                  disabled={currentPage >= pageCount}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="text-amber-600" size={18} />
                <h2 className="text-lg font-extrabold text-[#191c1e]">Prioritas Restock</h2>
              </div>
              <div className="space-y-3">
                {lowStockItems.length === 0 ? (
                  <div className="rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    Semua stok masih aman.
                  </div>
                ) : (
                  lowStockItems.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openMovementForm(item, 'in')}
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50/70 p-3 text-left transition hover:bg-amber-50"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-amber-900">{item.name}</div>
                        <div className="text-xs text-amber-700">
                          {item.quantity} {item.unit} tersisa, min {item.minStock}
                        </div>
                      </div>
                      <PackagePlus size={18} className="shrink-0 text-amber-700" />
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <History className="text-[#00488d]" size={18} />
                  <h2 className="text-lg font-extrabold text-[#191c1e]">Riwayat Terbaru</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                  {totalMovements}
                </span>
              </div>
              <div className="space-y-3">
                {movements.length === 0 ? (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    Belum ada pergerakan stok.
                  </div>
                ) : (
                  movements.map((movement) => (
                    <div key={movement.id} className="rounded-lg border border-slate-100 p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${movementTone(
                            movement.type
                          )}`}
                        >
                          {movementIcon(movement.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-slate-800">
                                {movement.item?.name ?? 'Item inventory'}
                              </div>
                              <div className="text-xs text-slate-500">
                                {movementLabel(movement.type)} sebanyak {movement.quantity}{' '}
                                {movement.item?.unit ?? ''}
                              </div>
                            </div>
                            <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                              {formatDateTime(movement.createdAt)}
                            </span>
                          </div>
                          {movement.note ? (
                            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{movement.note}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-lg border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-slate-500" size={18} />
                <h2 className="text-lg font-extrabold text-[#191c1e]">Aturan Stok</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Status otomatis dibaca dari minimum dan maksimum stok pada setiap item. Ubah batasnya
                lewat tombol edit item.
              </p>
            </section>
          </aside>
        </section>
      </div>
    </main>
  )
}
