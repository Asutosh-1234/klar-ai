'use client'

import { EmailTextContentProps } from "@/lib/types";

export function EmailTextContent({ subject, snippet, isUnread, className = "" }: EmailTextContentProps) {
  return (
    <div className={`flex items-center min-w-0 overflow-hidden gap-2 ${className}`}>
      <span className={`shrink-0 truncate max-w-[40%] text-sm ${isUnread ? "font-bold text-white" : "text-on-surface font-normal"}`}>
        {subject}
      </span>
      {snippet && (
        <span className="text-on-surface-variant text-sm font-normal truncate min-w-0 flex-1">
          — {snippet}
        </span>
      )}
    </div>
  );
}
