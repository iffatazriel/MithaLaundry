'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  turnaround: string;
  iconColor: string;
}

const initialServices: Service[] = [
  {
    id: 1,
    name: 'Cuci Setrika',
    description: 'Wash and Ironing',
    price: 5000,
    unit: 'kg',
    turnaround: '2 Days',
    iconColor: 'blue',
  },
  {
    id: 2,
    name: 'Setrika Saja',
    description: 'Ironing Only',
    price: 4000,
    unit: 'kg',
    turnaround: '1 Day',
    iconColor: 'orange',
  },
  {
    id: 3,
    name: 'Bedcover Large',
    description: 'Deep Cleaning',
    price: 15000,
    unit: 'pc',
    turnaround: '3 Days',
    iconColor: 'gray',
  },
];

const iconColorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  orange: 'bg-orange-50 text-orange-500',
  gray: 'bg-gray-100 text-gray-500',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
};

const iconColors = ['blue', 'orange', 'gray', 'green', 'purple'];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  unit: string;
  turnaround: string;
  iconColor: string;
}

const emptyForm: ServiceFormData = {
  name: '',
  description: '',
  price: '',
  unit: 'kg',
  turnaround: '',
  iconColor: 'blue',
};

export default function PricingServices() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<ServiceFormData>(emptyForm);

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      unit: service.unit,
      turnaround: service.turnaround,
      iconColor: service.iconColor,
    });
    setShowAddForm(false);
  };

  const handleSaveEdit = (id: number) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              name: form.name,
              description: form.description,
              price: Number(form.price),
              unit: form.unit,
              turnaround: form.turnaround,
              iconColor: form.iconColor,
            }
          : s
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddService = () => {
    if (!form.name || !form.price) return;
    const newService: Service = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      unit: form.unit,
      turnaround: form.turnaround,
      iconColor: form.iconColor,
    };
    setServices((prev) => [...prev, newService]);
    setShowAddForm(false);
    setForm(emptyForm);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="pricing" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Pricing & Services</h2>
          <p className="text-sm text-gray-500 mt-1">
            Define your service rates and estimated turnaround times.
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); setForm(emptyForm); }}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
        >
          <Plus size={15} />
          Add Service
        </button>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="mb-4 p-4 border border-blue-300 bg-blue-50/40 rounded-xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-3">New Service</p>
          <ServiceForm form={form} onChange={handleFormChange} />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAddService}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-500 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {services.map((service) => (
          <div key={service.id}>
            {editingId === service.id ? (
              <div className="py-4 px-2 bg-amber-50/40 rounded-xl border border-amber-100 my-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-3">Editing: {service.name}</p>
                <ServiceForm form={form} onChange={handleFormChange} />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleSaveEdit(service.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-500 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 py-3.5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColorMap[service.iconColor] || iconColorMap.gray}`}>
                  <ServiceIcon name={service.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{service.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{service.description} • {service.turnaround}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600 mr-2 whitespace-nowrap">
                  Rp {formatRupiah(service.price)} /{service.unit}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          No services yet. Click &quot;Add Service&quot; to get started.
        </div>
      )}
    </section>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes('cuci') || lower.includes('wash')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6l9-3 9 3M3 6v12l9 3 9-3V6" />
      </svg>
    );
  }
  if (lower.includes('setrika') || lower.includes('iron')) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function ServiceForm({
  form,
  onChange,
}: {
  form: ServiceFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Service Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="e.g. Cuci Setrika"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="e.g. Wash and Ironing"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Price (Rp)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={onChange}
          placeholder="e.g. 8000"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Unit</label>
          <select
            name="unit"
            value={form.unit}
            onChange={onChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="kg">kg</option>
            <option value="pc">pc</option>
            <option value="pcs">pcs</option>
            <option value="set">set</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Turnaround</label>
          <input
            type="text"
            name="turnaround"
            value={form.turnaround}
            onChange={onChange}
            placeholder="e.g. 2 Days"
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>
    </div>
  );
}

// Needed for TS — export iconColors so it can be used if needed
export { iconColors };