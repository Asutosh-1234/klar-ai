'use client'

import { EmailTextContentProps } from "@/app/lib/types";

export function EmailTextContent({ subject, snippet, isUnread, className = "" }: EmailTextContentProps) {
  return (
    <div className={`flex-1 min-w-0 pr-4 text-sm truncate ${className}`}>
      <span className={isUnread ? "font-bold text-white" : "text-on-surface font-normal"}>
        {subject}
      </span>
      <span className="text-on-surface-variant pl-4 font-normal">
        {snippet}
      </span>
    </div>
  );
}
