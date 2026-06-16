'use client'

import * as React from "react";

interface PurchaseFilterBarProps {
  activeFilter: 'All' | 'Receipts' | 'Invoices' | 'Confirmations';
  setActiveFilter: (filter: 'All' | 'Receipts' | 'Invoices' | 'Confirmations') => void;
  monthlyBurn: number;
}

export function PurchaseFilterBar({
  activeFilter,
  setActiveFilter,
  monthlyBurn,
}: PurchaseFilterBarProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8 bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl p-1.5 flex flex-wrap gap-1 items-center">
        {(['All', 'Receipts', 'Invoices', 'Confirmations'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === filter
                ? ' bg-gray-300 text-stone-950 font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            {filter === 'All' ? 'All Activities' : filter}
          </button>
        ))}
        <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block"></div>
        <button className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          <span>Last 30 Days</span>
        </button>
      </div>

      <div className="col-span-12 lg:col-span-4 bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl p-3 flex items-center justify-between px-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-on-surface-variant opacity-60 uppercase tracking-wider">Monthly Burn</span>
          <span className="text-white font-display text-lg font-bold">
            ${monthlyBurn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <span className="text-error font-mono text-[10px] bg-error/10 px-2 py-0.5 rounded border border-error/10 font-bold">+4.2%</span>
      </div>
    </div>
  );
}
