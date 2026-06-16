'use client'

import { useState } from 'react';
import { Transaction } from '@/lib/types';
import { PurchaseHeader } from './PurchaseHeader';
import { PurchaseFilterBar } from './PurchaseFilterBar';
import { TransactionTable } from './TransactionTable';
import { PurchaseInsights } from './PurchaseInsights';

export function AetherPurchasesView() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Receipts' | 'Invoices' | 'Confirmations'>('All');

  const transactions: Transaction[] = [];

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Receipts') return tx.category === 'Receipt';
    if (activeFilter === 'Invoices') return tx.category === 'Invoice';
    if (activeFilter === 'Confirmations') return tx.category === 'Confirmation';
    return true;
  });

  const monthlyBurn = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-surface text-on-surface custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <PurchaseHeader />

        {/* Bento Filter & KPI Bar */}
        <PurchaseFilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          monthlyBurn={monthlyBurn}
        />

        {/* Transactions Ledger Table */}
        <TransactionTable transactions={filteredTransactions} />

        {/* Contextual Insights Section */}
        <PurchaseInsights />

      </div>
    </div>
  );
}
