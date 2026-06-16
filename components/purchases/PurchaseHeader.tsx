'use client'

import * as React from "react";

export function PurchaseHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-primary mb-1">
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">Financial Ledger</span>
        </div>
        <h2 className="font-display text-3xl font-semibold text-white">Purchases</h2>
        <p className="text-xs text-on-surface-variant mt-2 max-w-md opacity-80 leading-relaxed">
          Overview of corporate expenditures, verified receipts, and automated payment cycles.
        </p>
      </div>
      
      <div className="flex gap-3 shrink-0">
        <button className="px-4 py-2 border border-white/10 rounded bg-surface-container hover:bg-surface-container-high text-xs text-on-surface transition-all flex items-center gap-2 hover:text-white cursor-pointer">
          <span className="material-symbols-outlined text-sm">download</span>
          <span>Export CSV</span>
        </button>
        <button className="px-4 py-2 bg-olive-300 rounded text-black text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] cursor-pointer">
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Record Expense</span>
        </button>
      </div>
    </div>
  );
}
