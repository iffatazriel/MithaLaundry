'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface StoreInfo {
  storeName: string;
  whatsappNumber: string;
  storeAddress: string;
}

const initialData: StoreInfo = {
  storeName: 'Mitha Laundry & Dry Cleaning',
  whatsappNumber: '+6281234567890',
  storeAddress: 'Jl. K.H. Ahmad Dahlan, Dukuhwaluh, Kec. Kembaran, Kab. Banyumas, Jawa Tengah.',
};

export default function GeneralStoreInfo() {
  const [form, setForm] = useState<StoreInfo>(initialData);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    // TODO: call API to save store info
    console.log('Saving store info:', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section id="store" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800">General Store Info</h2>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Manage your public laundry shop identity and contact details.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            Store Name
          </label>
          <input
            type="text"
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            WhatsApp Number
          </label>
          <input
            type="text"
            name="whatsappNumber"
            value={form.whatsappNumber}
            onChange={handleChange}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Store Address
        </label>
        <textarea
          name="storeAddress"
          value={form.storeAddress}
          onChange={handleChange}
          rows={3}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </section>
  );
}