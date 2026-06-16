'use client'

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PurchaseInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Run Rate */}
      <Card className="bg-surface-container/60 backdrop-blur-xl border border-white/5 p-2 px-4 rounded-xl flex flex-col justify-between h-36 shadow-none ring-0">
        <div>
          <span className="material-symbols-outlined text-primary mb-2 text-xl">account_balance_wallet</span>
          <h4 className="font-semibold text-xs text-white">Projected Run Rate</h4>
          <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">Based on last 90 days of automated spend.</p>
        </div>
        <div className="mt-4">
          <p className="text-xl font-bold text-white">$512k <span className="text-[10px] text-on-surface-variant font-normal">/ yr</span></p>
        </div>
      </Card>

      {/* Card 2: Optimization Tip */}
      <Card className="bg-surface-container/60 backdrop-blur-xl border border-white/5 border-t-2 border-t-primary/60 p-2 px-4 rounded-xl flex flex-col justify-between h-36 shadow-none ring-0">
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
      </Card>

      {/* Card 3: Tax Compliance */}
      <Card className="bg-surface-container/60 backdrop-blur-xl border border-white/5 p-2 px-4 rounded-xl flex flex-col justify-between h-36 shadow-none ring-0">
        <div>
          <span className="material-symbols-outlined text-primary mb-2 text-xl">security</span>
          <h4 className="font-semibold text-xs text-white">Tax Compliance</h4>
          <p className="text-[10px] text-on-surface-variant opacity-60 mt-1">98% of receipts automatically matched.</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Progress value={98} className="flex-1 bg-surface-container-highest" />
          <span className="text-[10px] font-bold text-white">98%</span>
        </div>
      </Card>
    </div>
  );
}
