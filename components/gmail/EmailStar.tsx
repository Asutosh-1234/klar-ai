'use client'

import { EmailStarProps } from "@/lib/types";

export function EmailStar({ isStarred, onToggle }: EmailStarProps) {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.();
      }}
      className={`material-symbols-outlined text-[18px] transition-colors cursor-pointer shrink-0 ${
        isStarred ? "text-amber-400 font-fill text-fill-1" : "text-on-surface-variant hover:text-white"
      }`}
      style={{ fontVariationSettings: isStarred ? "'FILL' 1" : "'FILL' 0" }}
    >
      star
    </span>
  );
}
