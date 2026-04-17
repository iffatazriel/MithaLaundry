'use client';

import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function InventoryHeader() {
  const [restocking, setRestocking] = useState(false);

  const handleRestock = () => {
    setRestocking(true);
    setTimeout(() => setRestocking(false), 2000);
  };

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
          Stock Overview
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Supplies Control</h1>
      </div>
      <button
        onClick={handleRestock}
        disabled={restocking}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 ${
          restocking
            ? 'bg-green-500 text-white scale-95'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <RotateCcw size={15} className={restocking ? 'animate-spin' : ''} />
        {restocking ? 'Restocking...' : 'Restock Supplies'}
      </button>
    </div>
  );
}