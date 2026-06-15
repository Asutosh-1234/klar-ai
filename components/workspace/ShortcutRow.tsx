'use client'

import React from "react";
import { ShortcutRowProps, KeyBadgeProps } from "@/lib/types";

export function KeyBadge({ children, size = 'sm' }: KeyBadgeProps) {
  return (
    <kbd className={`px-1.5 py-0.5 bg-surface-container-highest border border-white/10 rounded font-mono text-primary ${
      size === 'sm' ? 'text-[9px]' : 'text-[10px]'
    }`}>
      {children}
    </kbd>
  );
}

export function ShortcutRow({ label, children }: ShortcutRowProps) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/3">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <span className="flex items-center gap-1">
        {children}
      </span>
    </div>
  );
}
