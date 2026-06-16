'use client'

import * as React from "react";
import { Transaction } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const formatFileSize = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  return (
    <div className="bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden shadow-xl">
      <Table className="min-w-[600px] border-collapse w-full">
        <TableHeader className="border-b border-white/5 bg-surface-container-high/50">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest h-auto">Transaction</TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest h-auto">Category</TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right h-auto">Amount</TableHead>
            <TableHead className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest h-auto">Status</TableHead>
            <TableHead className="px-6 py-4 w-10 h-auto"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-white/3 border-none">
          {transactions.length === 0 ? (
            <TableRow className="border-none hover:bg-transparent">
              <TableCell colSpan={5} className="px-6 py-10 text-center text-on-surface-variant opacity-60 text-xs">
                No purchases or transactions recorded
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} className="border-b border-white/3 hover:bg-white/2 transition-colors group cursor-pointer">
                <TableCell className="px-6 py-4">
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
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest border border-white/5 text-secondary text-[9px] font-bold uppercase tracking-wider">
                    {tx.category}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <p className="font-mono text-white text-xs font-semibold">${formatFileSize(tx.amount)}</p>
                </TableCell>
                <TableCell className="px-6 py-4">
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
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-white transition-colors text-base">chevron_right</span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Table Footer */}
      <div className="bg-surface-container-high/40 px-6 py-3.5 flex items-center justify-between border-t border-white/5">
        <p className="text-[10px] text-on-surface-variant opacity-60">
          Showing {transactions.length} of {transactions.length} transactions
        </p>
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
  );
}
