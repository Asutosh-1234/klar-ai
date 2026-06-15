'use client'

import { useState } from 'react';

interface Transaction {
  id: string;
  vendor: string;
  date: string;
  invoice: string;
  category: string;
  amount: number;
  status: 'Verified' | 'Pending';
  logo?: string;
  icon?: string;
}

export function AetherPurchasesView() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Receipts' | 'Invoices' | 'Confirmations'>('All');

  const transactions: Transaction[] = [
    {
      id: 'tx_1',
      vendor: 'Amazon Web Services',
      date: 'Nov 24, 2023',
      invoice: 'Inv-8921-X',
      category: 'Infrastructure',
      amount: 12450.00,
      status: 'Verified',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYxkPXroLwoueckJIyjCA_dJ6PH3VcSUSG7nSOyhjtfy4XNIkBLshzsJC_Z5sKRxB2oD460ZnxO1fquAzK_Nl3bidd_bmBq6DpwfZu-pmpJmgooQ8vxIsDhKvQYKxYJWsImVXbdLYIa0nB8KssLDNKLj5w-AhsjCGbBoIBhashbBLJxZES7zfSvM9BbvW7bB2lysk17TfJtEK3_lYu1_CNc9nsy9G6sTK1ZcU88vOA5B2C2BuHopXB'
    },
    {
      id: 'tx_2',
      vendor: 'OpenAI Enterprise',
      date: 'Nov 22, 2023',
      invoice: 'Monthly Seat',
      category: 'AI Services',
      amount: 4200.00,
      status: 'Verified',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIXFWh5pk6Xlu2lgf1LSZOdNinJ3ByANc7sB2K8PcgrX0PmyACZx0-nDcOODDkSOJcgHw2f_hidP6yMzVOG3MuBWSJa5h3u32AK33UGN8xFOYU7vC5hz3Q09XcKNRxIRvZAJp-FqGsw_s6fibc6hMjDFy8FjmE0qfwKg6LwHOPYKqHX4robowJJqUQ8PoAVzBaW6D7ntcQaAqyoJBb5tJ-DqXINp-PmJnWhAKKkRCaMdnngICmUCEE'
    },
    {
      id: 'tx_3',
      vendor: 'Private Suite - London',
      date: 'Nov 18, 2023',
      invoice: 'Q4 Rental',
      category: 'Operations',
      amount: 18500.00,
      status: 'Pending',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYO4nOoio29AF5HTr8LHIBu5CkjXyN3_0wV5MrnysEXftNNFC7XLYa6N2EQn_8UgcmPoTM-0iDJ025B-QwdC2Fa1AxRBCB85DRBYgiZUFI03GxylVjmyqXyU0BykgcfZ0IuwXB6qMebcvHB9wFYpvezsfZ0W6X7DOvCiPO-iSI1HAV5yPrHZ6lrLExKhTk_I6ou1pI7w8QodSHAKfvmESrZK9CSWSjkggkWTf1e4vcA_2u_N4vyE2y'
    },
    {
      id: 'tx_4',
      vendor: 'Delta Airlines',
      date: 'Nov 15, 2023',
      invoice: 'Exec Travel',
      category: 'Logistics',
      amount: 2760.00,
      status: 'Verified',
      icon: 'airplane_ticket'
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-surface text-on-surface custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
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
            <button className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] cursor-pointer">
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Record Expense</span>
            </button>
          </div>
        </div>

        {/* Bento Filter Bar */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl p-1.5 flex flex-wrap gap-1 items-center">
            {(['All', 'Receipts', 'Invoices', 'Confirmations'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
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
              <span className="text-white font-display text-lg font-bold">$42,910.00</span>
            </div>
            <span className="text-error font-mono text-[10px] bg-error/10 px-2 py-0.5 rounded border border-error/10 font-bold">+4.2%</span>
          </div>
        </div>

        {/* Transactions Ledger Table */}
        <div className="bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 bg-surface-container-high/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/2 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                          {tx.logo ? (
                            <img src={tx.logo} alt={tx.vendor} className="w-6 h-6 object-contain" />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-xl">{tx.icon}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-white group-hover:text-primary transition-colors">{tx.vendor}</p>
                          <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">{tx.date} • {tx.invoice}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest border border-white/5 text-secondary text-[9px] font-bold uppercase tracking-wider">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-mono text-white text-xs font-semibold">${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === 'Verified' ? (
                        <div className="flex items-center gap-1 text-primary">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-[10px] font-semibold">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-on-surface-variant opacity-60">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          <span className="text-[10px] font-semibold">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors text-base">chevron_right</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-surface-container-high/40 px-6 py-3.5 flex items-center justify-between border-t border-white/5">
            <p className="text-[10px] text-on-surface-variant opacity-60">Showing 1-4 of 128 transactions</p>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-white cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant hover:text-white cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contextual Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Run Rate */}
          <div className="bg-surface-container/60 backdrop-blur-xl border border-white/5 p-6 rounded-xl flex flex-col justify-between h-36">
            <div>
              <span className="material-symbols-outlined text-primary mb-2 text-xl">account_balance_wallet</span>
              <h4 className="font-semibold text-xs text-white">Projected Run Rate</h4>
              <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Based on last 90 days of automated spend.</p>
            </div>
            <div className="mt-4">
              <p className="text-xl font-bold text-white">$512k <span className="text-[10px] text-on-surface-variant font-normal">/ yr</span></p>
            </div>
          </div>

          {/* Card 2: Optimization Tip */}
          <div className="bg-surface-container/60 backdrop-blur-xl border border-white/5 border-t-2 border-t-primary/60 p-6 rounded-xl flex flex-col justify-between h-36">
            <div>
              <span className="material-symbols-outlined text-primary mb-2 text-xl">auto_awesome</span>
              <h4 className="font-semibold text-xs text-white">Optimization Tip</h4>
              <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">3 subscriptions have overlapping features.</p>
            </div>
            <div className="mt-4">
              <button className="text-primary text-[9px] font-bold uppercase tracking-widest hover:underline cursor-pointer">
                Review AI Audit
              </button>
            </div>
          </div>

          {/* Card 3: Tax Compliance */}
          <div className="bg-surface-container/60 backdrop-blur-xl border border-white/5 p-6 rounded-xl flex flex-col justify-between h-36">
            <div>
              <span className="material-symbols-outlined text-primary mb-2 text-xl">security</span>
              <h4 className="font-semibold text-xs text-white">Tax Compliance</h4>
              <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">98% of receipts automatically matched.</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-primary rounded-full" style={{ width: '98%' }}></div>
              </div>
              <span className="text-[10px] font-bold text-white">98%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
