'use client';

import { useState } from 'react';
import { Settings2, Bot } from 'lucide-react';

interface AutoRestockRule {
  id: number;
  itemName: string;
  threshold: number;
  orderQuantity: number;
  enabled: boolean;
}

const rules: AutoRestockRule[] = [
  { id: 1, itemName: 'Plastic Bags', threshold: 10, orderQuantity: 20, enabled: true },
  { id: 2, itemName: 'Premium Detergent', threshold: 5, orderQuantity: 10, enabled: true },
  { id: 3, itemName: 'Wire Hangers', threshold: 8, orderQuantity: 15, enabled: false },
];

export default function AutoRestockBanner() {
  const [showRules, setShowRules] = useState(false);
  const [ruleList, setRuleList] = useState<AutoRestockRule[]>(rules);

  const toggleRule = (id: number) => {
    setRuleList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="grid grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Left: Blue Panel */}
      <div className="bg-blue-600 p-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-blue-500 opacity-40" />
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-blue-400 opacity-30" />

        {/* Bot icon */}
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 border border-white/20">
          <Bot size={20} className="text-white" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 relative z-10">
          Auto-Restock is Active
        </h3>
        <p className="text-sm text-blue-100 leading-relaxed mb-6 relative z-10 max-w-[280px]">
          Your system is automatically ordering supplies when they hit critical levels. Last auto-order:{' '}
          <span className="font-semibold text-white">Plastic Bags (x20)</span>.
        </p>

        {/* Manage Rules Button */}
        <button
          onClick={() => setShowRules(!showRules)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition relative z-10 shadow-sm"
        >
          <Settings2 size={14} />
          Manage Rules
        </button>

        {/* Rules Panel */}
        {showRules && (
          <div className="mt-5 bg-white/10 border border-white/20 rounded-xl p-4 relative z-10 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-3">
              Auto-Restock Rules
            </p>
            <div className="flex flex-col gap-3">
              {ruleList.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{rule.itemName}</p>
                    <p className="text-xs text-blue-200">
                      Order {rule.orderQuantity} when ≤ {rule.threshold} left
                    </p>
                  </div>
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      rule.enabled ? 'bg-white' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-blue-600 shadow transform transition ${
                        rule.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Image Panel */}
      <div className="relative overflow-hidden min-h-[260px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.pinimg.com/736x/82/d4/54/82d4549d3c8e7d4f39dafd7b0a1cedb4.jpg"
          alt="Organized laundry inventory"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Quote */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white text-sm font-medium leading-relaxed italic">
            &ldquo;An organized inventory is the backbone of a pristine service.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}